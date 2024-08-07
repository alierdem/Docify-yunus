import React, { useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  CircularProgress,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [downloadFormat, setDownloadFormat] = useState("json");
  const [additionalField, setAdditionalField] = useState("");
  const [updatedResult, setUpdatedResult] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileRemove = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setCheckedItems({});
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
      const initialCheckedState = Object.keys(response.data).reduce(
        (acc, key) => {
          acc[key] = true;
          return acc;
        },
        {}
      );
      setCheckedItems(initialCheckedState);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.response?.data?.error || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => {
    if (!file) return null;

    return (
      <Box sx={{ position: "relative", mt: 2, textAlign: "center" }}>
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          onClick={handleFileRemove}
        >
          <CloseIcon />
        </IconButton>
        <Box>
          <FileIcon sx={{ fontSize: 100, color: "primary.main" }} />
          <Typography variant="body1">{file.name}</Typography>
        </Box>
      </Box>
    );
  };

  const handleCheckboxChange = (key) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAdditionalFieldChange = (event) => {
    setAdditionalField(event.target.value);
  };

  const handleAdditionalFieldSubmit = async () => {
    if (!additionalField) {
      setError("Please enter an additional field to search for");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/search_additional_field",
        {
          file_path: file.name,
          field: additionalField,
        }
      );

      if (response.data.found) {
        setUpdatedResult(response.data.result);
        // Merge the new result with the existing one
        setResult((prevResult) => ({ ...prevResult, ...response.data.result }));
        setCheckedItems((prevCheckedItems) => ({
          ...prevCheckedItems,
          [additionalField]: true,
        }));
      } else {
        // Show a warning message
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error searching additional field:", error);
      setError(
        error.response?.data?.error || "Error searching additional field"
      );
    } finally {
      setLoading(false);
      setAdditionalField(""); // Clear the input field after search
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const filteredResult = Object.entries(result).filter(
      ([, value]) => value !== "" && value !== null
    );

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Analysis Result:
        </Typography>
        <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f8f8f8" }}>
          {filteredResult.map(([key, value]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedItems[key]}
                    onChange={() => handleCheckboxChange(key)}
                  />
                }
                label={
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight="bold"
                  >
                    {key.replace(/_/g, " ").toUpperCase()}:
                  </Typography>
                }
              />
              <Typography
                variant="body1"
                sx={{
                  textDecoration: checkedItems[key] ? "none" : "line-through",
                  color: checkedItems[key] ? "inherit" : "gray",
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    );
  };

  const handleDownload = () => {
    const selectedData = Object.entries(result)
      .filter(([key]) => checkedItems[key])
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    if (downloadFormat === "json") {
      const blob = new Blob([JSON.stringify(selectedData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice_analysis_result.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (downloadFormat === "csv") {
      const csvData = Object.entries(selectedData).map(([key, value]) => ({
        key: key.replace(/_/g, " ").toUpperCase(),
        value,
      }));
      const worksheet = XLSX.utils.json_to_sheet(csvData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
      XLSX.writeFile(workbook, "invoice_analysis_result.csv");
    } else if (downloadFormat === "xlsx") {
      const xlsxData = Object.entries(selectedData).map(([key, value]) => ({
        key: key.replace(/_/g, " ").toUpperCase(),
        value,
      }));
      const worksheet = XLSX.utils.json_to_sheet(xlsxData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
      XLSX.writeFile(workbook, "invoice_analysis_result.xlsx");
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          color="primary"
        >
          Invoice Analyzer
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            backgroundColor: isDragActive ? "#e3f2fd" : "white",
            transition: "background-color 0.3s",
          }}
        >
          <Box
            {...getRootProps()}
            sx={{ textAlign: "center", cursor: "pointer" }}
          >
            <input {...getInputProps()} />
            {!file && (
              <>
                <CloudUploadIcon
                  sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {isDragActive
                    ? "Drop the file here"
                    : "Drag & drop a file here, or click to select"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Supported file types: Images, PDFs, and more
                </Typography>
              </>
            )}
            {file && renderPreview()}
          </Box>
          {file && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? "Analyzing..." : "Analyze Invoice"}
              </Button>
            </Box>
          )}
        </Paper>
        {error && (
          <Typography
            color={error.includes("not found") ? "warning.main" : "error.main"}
            sx={{ mt: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        {renderResult()}
        {result && (
          <Box
            sx={{
              mt: 3,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TextField
                label="Search for additional field"
                variant="outlined"
                value={additionalField}
                onChange={handleAdditionalFieldChange}
                sx={{ mr: 2 }}
                error={!!error}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdditionalFieldSubmit}
                disabled={loading}
              >
                Search New Field
              </Button>
            </Box>

            {error && (
              <Typography
                color={
                  error.includes("not found") ? "warning.main" : "error.main"
                }
                sx={{ mt: 1, textAlign: "center" }}
              >
                {error}
              </Typography>
            )}
          </Box>
        )}
        {result && (
          <Box
            sx={{
              mt: 3,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormControl sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel id="format-select-label"></InputLabel>
              <Select
                labelId="format-select-label"
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                sx={{
                  width: 150,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <MenuItem value="json">JSON</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="xlsx">XLSX</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleDownload}
              startIcon={<DownloadIcon />}
            >
              Download Selected Results
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;

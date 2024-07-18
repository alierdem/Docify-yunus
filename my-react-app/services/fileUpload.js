export async function uploadFile(file) {
    // Create a local URL for the file
    const fileUrl = URL.createObjectURL(file);
    
    // Simulate a short delay to mimic network latency
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('File processed locally:', file.name);
    console.log('Local URL:', fileUrl);
    
    return fileUrl;
  }
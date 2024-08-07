# Docify Deployment

# Authenticate with Google Cloud
gcloud auth login

# Set your project
gcloud config set project {PROJECT_ID}

# Enable required services
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Build your Docker image
docker build -t gcr.io/{PROJECT_ID}/docify .

# Push the Docker image to Google Container Registry
docker push gcr.io/{PROJECT_ID}/docify


gcloud artifacts repositories create my-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository"


# Deploy to Cloud Run (Linux)
gcloud run deploy docify \
    --image gcr.io/{PROJECT_ID}/docify \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars "AZURE_FORM_RECOGNIZER_ENDPOINT={AZURE_ENDPOINT},AZURE_FORM_RECOGNIZER_KEY={AZURE_KEY}"

# Deploy to Cloud Run (Windows)
gcloud run deploy docify ^
    --image gcr.io/{PROJECT_ID}/docify ^
    --platform managed ^
    --region us-central1 ^
    --allow-unauthenticated ^
    --set-env-vars "AZURE_FORM_RECOGNIZER_ENDPOINT={AZURE_ENDPOINT},AZURE_FORM_RECOGNIZER_KEY={AZURE_KEY}"

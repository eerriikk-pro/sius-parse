# Use the official AWS Lambda Python 3.11 image
FROM public.ecr.aws/lambda/python:3.13

# Set working directory
WORKDIR /var/task

# Copy requirements and app code
COPY requirements.txt ./
COPY app/ ./app/

# Install dependencies into the current directory (Lambda expects this)
RUN pip install --upgrade pip \
    && pip install -r requirements.txt -t .

    # Set the Lambda handler entrypoint
CMD ["app.main.handler"] 
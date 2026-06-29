"""S3 client for handling file uploads and storage operations."""
import logging
from typing import Optional, List, Dict, Any

from pydantic import BaseModel
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)

class S3Client(BaseModel):  # type: ignore[operator]
    """S3 client for handling file uploads and storage operations."""
    bucket_name: str
    aws_access_key_id: Optional[str] = None
    aws_secret_access_key: Optional[str] = None
    region_name: Optional[str] = None
    endpoint_url: Optional[str] = None

    class Config:
        """Pydantic configuration."""
        arbitrary_types_allowed = True

    def get_client(self):
        """Get configured S3 client."""
        return boto3.client(
            's3',
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
            region_name=self.region_name,
            endpoint_url=self.endpoint_url
        )

    def upload_file(self, file_path: str, object_name: str) -> bool:
        """Upload a file to S3 bucket."""
        try:
            client = self.get_client()
            client.upload_file(file_path, self.bucket_name, object_name)
            logger.info(f"File {file_path} uploaded to {object_name}")
            return True
        except ClientError as e:
            logger.error(f"Error uploading file {file_path}: {e}")
            return False

    def upload_file_object(self, file_object, object_name: str) -> bool:
        """Upload a file object to S3 bucket."""
        try:
            client = self.get_client()
            client.upload_fileobj(file_object, self.bucket_name, object_name)
            logger.info(f"File object uploaded to {object_name}")
            return True
        except ClientError as e:
            logger.error(f"Error uploading file object {object_name}: {e}")
            return False

    def download_file(self, object_name: str, file_path: str) -> bool:
        """Download a file from S3 bucket."""
        try:
            client = self.get_client()
            client.download_file(self.bucket_name, object_name, file_path)
            logger.info(f"File {object_name} downloaded to {file_path}")
            return True
        except ClientError as e:
            logger.error(f"Error downloading file {object_name}: {e}")
            return False

    def delete_file(self, object_name: str) -> bool:
        """Delete a file from S3 bucket."""
        try:
            client = self.get_client()
            client.delete_object(Bucket=self.bucket_name, Key=object_name)
            logger.info(f"File {object_name} deleted from bucket")
            return True
        except ClientError as e:
            logger.error(f"Error deleting file {object_name}: {e}")
            return False

    def file_exists(self, object_name: str) -> bool:
        """Check if a file exists in S3 bucket."""
        try:
            client = self.get_client()
            client.head_object(Bucket=self.bucket_name, Key=object_name)
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            logger.error(f"Error checking file existence {object_name}: {e}")
            raise

    def list_files(self, prefix: str = "") -> List[str]:
        """List files in S3 bucket with optional prefix."""
        try:
            client = self.get_client()
            paginator = client.get_paginator('list_objects_v2')
            pages = paginator.paginate(Bucket=self.bucket_name, Prefix=prefix)
            files = []
            for page in pages:
                if 'Contents' in page:
                    for obj in page['Contents']:
                        files.append(obj['Key'])
            return files
        except ClientError as e:
            logger.error(f"Error listing files with prefix {prefix}: {e}")
            return []

    def get_file_url(self, object_name: str, expiration: int = 3600) -> Optional[str]:
        """Generate a presigned URL to share an S3 object."""
        try:
            client = self.get_client()
            url = client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL for {object_name}: {e}")
            return None

# Module-level wrappers — routes import these directly
_s3_client_instance = S3Client()  # type: ignore[operator]

def upload_file(file_path: str, object_name: str) -> str:
    """Upload a file to S3 and return the object URL."""
    return _s3_client_instance.upload_file(file_path, object_name)

def download_file(object_name: str, dest_path: str) -> bool:
    """Download a file from S3 to dest_path."""
    return _s3_client_instance.download_file(object_name, dest_path)

def delete_file(object_name: str) -> bool:
    """Delete a file from S3."""
    return _s3_client_instance.delete_file(object_name)

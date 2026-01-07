import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env file
dotenv.config();

console.log('Checking Cloudinary Config...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '******' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'Not Set');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '******' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'Not Set');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
    // Use a sample image from the public directory
    const imagePath = path.join(__dirname, '../public/images/ads/details/detail_100_1.jpg');
    console.log('Uploading image from:', imagePath);

    if (!fs.existsSync(imagePath)) {
        console.error('Image not found at path:', imagePath);
        return;
    }

    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'queenalba/test',
        });
        console.log('-------------------------------------------');
        console.log('✅ Upload successful!');
        console.log('-------------------------------------------');
        console.log('URL:', result.secure_url);
        console.log('Public ID:', result.public_id);
        console.log('Format:', result.format);
        console.log('Bytes:', result.bytes);
        console.log('-------------------------------------------');
    } catch (error) {
        console.error('❌ Upload failed:', error);
    }
}

testUpload();

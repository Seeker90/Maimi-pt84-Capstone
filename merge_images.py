#!/usr/bin/env python3
"""
Script to merge service images side by side
"""

from PIL import Image
import requests
from io import BytesIO


def merge_images(left_url, right_url, output_path, service_name):
    """Merge two images side by side"""
    print(f"\n=== Merging {service_name} ===")
    print("Downloading images...")

    # Download images
    response_left = requests.get(left_url)
    response_right = requests.get(right_url)

    # Open images
    img_left = Image.open(BytesIO(response_left.content))
    img_right = Image.open(BytesIO(response_right.content))

    print(f"Left image size: {img_left.size}")
    print(f"Right image size: {img_right.size}")

    # Set target height (500px to match carousel height)
    target_height = 500

    # Calculate widths to maintain aspect ratios
    left_aspect = img_left.width / img_left.height
    right_aspect = img_right.width / img_right.height

    left_width = int(target_height * left_aspect)
    right_width = int(target_height * right_aspect)

    # Resize images
    img_left_resized = img_left.resize(
        (left_width, target_height), Image.Resampling.LANCZOS)
    img_right_resized = img_right.resize(
        (right_width, target_height), Image.Resampling.LANCZOS)

    print(f"Resized left: {img_left_resized.size}")
    print(f"Resized right: {img_right_resized.size}")

    # Create new image with combined width
    total_width = left_width + right_width
    merged_image = Image.new('RGB', (total_width, target_height))

    # Paste images side by side
    merged_image.paste(img_left_resized, (0, 0))
    merged_image.paste(img_right_resized, (left_width, 0))

    # Save merged image
    merged_image.save(output_path, 'JPEG', quality=95)

    print(f"✓ Merged image saved to: {output_path}")
    print(f"  Dimensions: {total_width}x{target_height}")


# Pet Services
merge_images(
    'https://d368g9lw5ileu7.cloudfront.net/races/races-74xxx/74779/raceBanner-2n2wPEFs-bDd_8h.png',
    'https://th.bing.com/th/id/R.4244c40f8714bb7b4096368b2e0aac23?rik=zWJVMIn%2fATMuQA&pid=ImgRaw&r=0',
    'public/pet-services-merged.jpg',
    'Pet Services'
)

# Car Services
merge_images(
    'https://www.fortador.com/wp-content/uploads/2022/11/brad-starkey-eP8h7YVhFHk-unsplash-1080x675.jpg',
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
    'public/car-services-merged.jpg',
    'Car Services'
)

# Home Care
merge_images(
    'https://cdnassets.stihlusa.com/1632165150-fs56rceact2002.jpg?fit=crop&h=554&w=984',
    'https://images.ctfassets.net/qppku9ygnsbb/504oJlJtZCRkXkWgbWWIxO/2ed758e9efdaeb4fc582efe324f0150f/home-improvement-loan-vs-equity-sharing.jpg',
    'public/home-care-merged.jpg',
    'Home Care'
)

# Personal Services
merge_images(
    'https://media.istockphoto.com/id/453936599/photo/woman-getting-her-makeup-done.jpg?s=612x612&w=0&k=20&c=SeueKhzqKRMvIvUZcJ6QvmzHDpBjC0x6vllC_MWovVY=',
    'https://ksbarbers.com/wp-content/uploads/2023/09/skin-fade-and-beard-trim.png.webp',
    'public/personal-services-merged.jpg',
    'Personal Services'
)

print("\n✓ All images merged successfully!")

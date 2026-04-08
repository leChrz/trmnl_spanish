import os
from PIL import Image, ImageEnhance

# Configuration
SOURCE_DIR = "images/source"
PROCESSED_DIR = "images/processed"
TARGET_SIZE = (400, 480) # Half screen for 7.5" display (800x480)

# 4-level grayscale palette (2-bit)
# Black, Dark Gray, Light Gray, White
PALETTE = [0, 0, 0, 85, 85, 85, 170, 170, 170, 255, 255, 255]
# Fill the rest of the 256 colors (P mode needs 256 colors)
PALETTE += [255] * (256 * 3 - len(PALETTE))

def process_image(filename):
    source_path = os.path.join(SOURCE_DIR, filename)
    processed_path = os.path.join(PROCESSED_DIR, filename)
    
    # Check if filename is an image
    if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        return

    print(f"Processing {filename}...")
    
    with Image.open(source_path) as img:
        # 1. Resize and crop to fill 400x480 (Cover-style)
        # Calculate aspect ratios
        target_ratio = TARGET_SIZE[0] / TARGET_SIZE[1]
        img_ratio = img.width / img.height
        
        if img_ratio > target_ratio:
            # Image is wider than target
            new_width = int(target_ratio * img.height)
            left = (img.width - new_width) / 2
            img = img.crop((left, 0, left + new_width, img.height))
        else:
            # Image is taller than target
            new_height = int(img.width / target_ratio)
            top = (img.height - new_height) / 2
            img = img.crop((0, top, img.width, top + new_height))
            
        img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        
        # 2. Enhance contrast for E-Ink clarity
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.2) # Boost contrast slightly
        
        # 3. Apply 2-bit Dithering
        # Create a palette image to use as a target for quantization
        p_img = Image.new('P', (1, 1))
        p_img.putpalette(PALETTE)
        
        # Convert image to RGB then quantize to our palette using Floyd-Steinberg
        dithered = img.convert('RGB').quantize(palette=p_img, dither=Image.FLOYDSTEINBERG)
        
        # 4. Save
        dithered.save(processed_path)
        print(f"Saved to {processed_path}")

def main():
    if not os.path.exists(PROCESSED_DIR):
        os.makedirs(PROCESSED_DIR)
        
    for filename in os.listdir(SOURCE_DIR):
        process_image(filename)

if __name__ == "__main__":
    main()

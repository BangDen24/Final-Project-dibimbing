import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage, createPost } from "@/api/api";

const ImageUploadPost = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Menggunakan ref untuk file input
  const fileInputRef = useRef(null);

  // Menghandle perubahan file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  // Menghandle submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!selectedFile) {
        throw new Error("Please select an image file");
      }

      if (!caption.trim()) {
        throw new Error("Please enter a caption");
      }

      // Upload image terlebih dahulu
      const uploadResponse = await uploadImage(selectedFile);
      const imageUrl = uploadResponse.data.url; // Pastikan API mengembalikan URL gambar

      // Membuat post dengan URL image
      await createPost({
        imageUrl,
        caption: caption.trim(),
      });

      setSuccess("Post created successfully!");
      setCaption("");
      setSelectedFile(null);

      // Reset file input menggunakan ref
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef} // Menggunakan ref untuk akses file input
              className="w-full"
              disabled={loading}
            />
          </div>

          <div>
            <Textarea
              placeholder="Enter your caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full"
              disabled={loading}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Post..." : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImageUploadPost;

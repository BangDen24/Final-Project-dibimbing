import { useState } from "react";
import { register } from "@/api/api";
import { useRouter } from "next/router";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
    phoneNumber: "",
    bio: "",
    website: "",
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await register(formData);
      if (response.status === 201) {
        // Arahkan pengguna ke halaman login atau halaman lain
        router.push("/login");
      }
    } catch (err) {
      setError("Gagal mendaftar. Pastikan semua data sudah benar.");
      console.error(err);
    }
  };

  return (
    <div className="w-screen h-[100vh] flex flex-col justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs bg-white rounded-lg shadow-md p-4"
      >
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Username", name: "username", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          {
            label: "Repeat Password",
            name: "passwordRepeat",
            type: "password",
          },
          { label: "Phone Number", name: "phoneNumber", type: "text" },
          { label: "Bio", name: "bio", type: "textarea" },
          { label: "Website", name: "website", type: "text" },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <label className="block text-gray-900 text-sm font-bold mb-1">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                rows={2}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-green-500 hover:text-gray-900 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-gray-900">
        Have an account?{" "}
        <a href="/login" className="text-gray-900 hover:text-green-600 font-bold">
          Login
        </a>
      </p>
    </div>
  );
}

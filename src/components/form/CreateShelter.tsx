"use client";

import {
  Building2,
  ChevronDown,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  UploadCloud,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateShelter } from "@/hooks";

interface CreateShelterProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const bangladeshDistricts: Record<string, string[]> = {
  Khulna: [
    "Khulna",
    "Khulna Sadar",
    "Batiaghata",
    "Dacope",
    "Dumuria",
    "Dighalia",
    "Koyra",
    "Paikgachha",
    "Phultala",
    "Rupsha",
  ],
  Cumilla: [
    "Cumilla",
    "Cumilla Sadar",
    "Barura",
    "Brahmanpara",
    "Burichang",
    "Chandina",
    "Chauddagram",
    "Daudkandi",
    "Debidwar",
    "Homna",
    "Laksam",
    "Muradnagar",
  ],
  Dhaka: [
    "Mirpur",
    "Dhaka",
    "Dhanmondi",
    "Gulshan",
    "Mohammadpur",
    "Uttara",
    "Tejgaon",
    "Savar",
    "Keraniganj",
  ],
  Sylhet: [
    "Sylhet",
    "Sylhet Sadar",
    "Beanibazar",
    "Bishwanath",
    "Dakshin Surma",
    "Fenchuganj",
    "Golapganj",
    "Gowainghat",
    "Jaintiapur",
    "Kanaighat",
    "Companiganj",
    "Zakiganj",
  ],
  Sunamganj: [
    "Sunamganj",
    "Sunamganj Sadar",
    "Chhatak",
    "Derai",
    "Dharampasha",
    "Dowarabazar",
    "Jagannathpur",
    "Jamalganj",
    "Tahirpur",
  ],
  Feni: [
    "Feni",
    "Feni Sadar",
    "Chhagalnaiya",
    "Daganbhuiyan",
    "Parshuram",
    "Fulgazi",
    "Sonagazi",
  ],
  Noakhali: [
    "Noakhali",
    "Noakhali Sadar",
    "Begumganj",
    "Chatkhil",
    "Companiganj",
    "Hatiya",
    "Senbagh",
    "Subarnachar",
  ],
  Chittagong: [
    "Chittagong",
    "Pahartali",
    "Kotwali",
    "Panchlaish",
    "Bakalia",
    "Hathazari",
    "Sitakunda",
    "Mirsharai",
    "Raozan",
    "Anwara",
  ],
};

export default function CreateShelter({
  onSuccess,
  onCancel,
}: CreateShelterProps) {
  const { mutateAsync: createShelterFn, isPending } = useCreateShelter();

  const [formData, setFormData] = useState({
    name: "",
    district: "",
    upazila: "",
    address: "",
    capacity: "",
    currentPeople: "0",
    contactPerson: "",
    contactPhone: "",
    imageUrl: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "district") {
      setFormData((prev) => ({ ...prev, district: value, upazila: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const combinedFiles = [...selectedFiles, ...filesArray].slice(0, 5);
      setSelectedFiles(combinedFiles);

      const previews = combinedFiles.map((file) => URL.createObjectURL(file));
      setFilePreviews(previews);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, idx) => idx !== index);
    setSelectedFiles(updatedFiles);

    URL.revokeObjectURL(filePreviews[index]);
    const updatedPreviews = filePreviews.filter((_, idx) => idx !== index);
    setFilePreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Shelter name is required");
      return;
    }
    if (!formData.district.trim()) {
      toast.error("District is required");
      return;
    }
    if (!formData.upazila.trim()) {
      toast.error("Upazila is required");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Detailed address is required");
      return;
    }
    const capNum = Number.parseInt(formData.capacity, 10);
    if (Number.isNaN(capNum) || capNum < 1) {
      toast.error("Capacity must be at least 1");
      return;
    }
    if (!formData.contactPerson.trim()) {
      toast.error("Contact person name is required");
      return;
    }
    if (!formData.contactPhone.trim()) {
      toast.error("Contact phone number is required");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("district", formData.district.trim());
      payload.append("upazila", formData.upazila.trim());
      payload.append("address", formData.address.trim());
      payload.append("capacity", String(capNum));
      payload.append(
        "currentPeople",
        String(Number.parseInt(formData.currentPeople || "0", 10) || 0),
      );
      payload.append("contactPerson", formData.contactPerson.trim());
      payload.append("contactPhone", formData.contactPhone.trim());

      // Append uploaded image files
      selectedFiles.forEach((file) => {
        payload.append("images", file);
      });

      // Append image URL if supplied
      if (formData.imageUrl.trim()) {
        payload.append("images", formData.imageUrl.trim());
      }

      await createShelterFn(payload);
      toast.success("Emergency Shelter created successfully!");
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "data" in err
          ? (err.data as { message?: string })?.message
          : err instanceof Error
            ? err.message
            : "Failed to create shelter";
      toast.error(
        errorMsg || "Failed to create shelter. Please verify details.",
      );
    }
  };

  const currentUpazilas = formData.district
    ? bangladeshDistricts[formData.district] || []
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Shelter Name */}
      <div>
        <label
          htmlFor="shelter-name"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          Shelter Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="shelter-name"
            name="name"
            type="text"
            required
            placeholder="e.g. Khulna Community Shelter live"
            value={formData.name}
            onChange={handleTextChange}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* District & Upazila Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="shelter-district"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            District <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              id="shelter-district"
              name="district"
              required
              value={formData.district}
              onChange={handleTextChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-8 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 appearance-none cursor-pointer"
            >
              <option value="">Select District</option>
              {Object.keys(bangladeshDistricts).map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="shelter-upazila"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Upazila / Area <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            {currentUpazilas.length > 0 ? (
              <select
                id="shelter-upazila"
                name="upazila"
                required
                value={formData.upazila}
                onChange={handleTextChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-8 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 appearance-none cursor-pointer"
              >
                <option value="">Select Upazila</option>
                {currentUpazilas.map((upa) => (
                  <option key={upa} value={upa}>
                    {upa}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="shelter-upazila"
                name="upazila"
                type="text"
                required
                placeholder="e.g. Khulna Sadar, Mirpur"
                value={formData.upazila}
                onChange={handleTextChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-400"
              />
            )}
            {currentUpazilas.length > 0 && (
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {/* Detailed Address */}
      <div>
        <label
          htmlFor="shelter-address"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
        >
          Detailed Street Address <span className="text-red-500">*</span>
        </label>
        <input
          id="shelter-address"
          name="address"
          type="text"
          required
          placeholder="e.g. Section 10, Block A, Community Center Building"
          value={formData.address}
          onChange={handleTextChange}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-400"
        />
      </div>

      {/* Capacity & Current Intake */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="shelter-capacity"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Total Capacity (Persons) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="shelter-capacity"
              name="capacity"
              type="number"
              min="1"
              required
              placeholder="e.g. 500"
              value={formData.capacity}
              onChange={handleTextChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="shelter-current"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Current People Accommodated
          </label>
          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="shelter-current"
              name="currentPeople"
              type="number"
              min="0"
              placeholder="0"
              value={formData.currentPeople}
              onChange={handleTextChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Contact Person & Contact Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="shelter-contact-person"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Contact Person <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="shelter-contact-person"
              name="contactPerson"
              type="text"
              required
              placeholder="e.g. Mohon, Rahim Mia"
              value={formData.contactPerson}
              onChange={handleTextChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="shelter-contact-phone"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Contact Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="shelter-contact-phone"
              name="contactPhone"
              type="tel"
              required
              placeholder="e.g. 01899887466"
              value={formData.contactPhone}
              onChange={handleTextChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Image File Upload & URL */}
      <div className="space-y-2">
        <label
          htmlFor="shelter-images-input"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
        >
          Shelter Photos (Upload or Direct Link)
        </label>

        {/* Upload Zone */}
        <label
          htmlFor="shelter-images-input"
          className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-blue-50/20"
        >
          <UploadCloud className="h-7 w-7 text-blue-600 mb-1.5" />
          <p className="text-xs font-semibold text-slate-700">
            Click to upload photos{" "}
            <span className="text-slate-400 font-normal">(Max 5 images)</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            PNG, JPG, WEBP up to 5MB
          </p>
          <input
            id="shelter-images-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Selected Image Thumbnails */}
        {filePreviews.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filePreviews.map((previewUrl, idx) => (
              <div
                key={previewUrl}
                className="relative h-16 w-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs group"
              >
                <Image
                  src={previewUrl}
                  alt={`Preview ${idx + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Fallback Image URL Input */}
        <div className="pt-1">
          <div className="relative">
            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              name="imageUrl"
              type="url"
              placeholder="Or paste image URL (Cloudinary / Direct link)"
              value={formData.imageUrl}
              onChange={handleTextChange}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Verified Notice */}
      <div className="flex items-center gap-2 rounded-xl bg-blue-50/60 border border-blue-100/80 px-3.5 py-2.5 text-xs text-blue-900">
        <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
        <span>
          Shelter will be activated immediately and published to the public
          shelter finder.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B2545] hover:bg-[#081b33] text-white font-bold text-xs px-6 py-2.5 shadow-md shadow-[#0B2545]/20 transition-all hover:shadow-lg disabled:opacity-60"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Publishing Shelter...</span>
            </>
          ) : (
            <span>Publish Shelter</span>
          )}
        </button>
      </div>
    </form>
  );
}

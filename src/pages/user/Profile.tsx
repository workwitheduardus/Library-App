import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import UserLayout from "@/layouts/UserLayout";
import ProfileTabs from "@/components/user/ProfileTabs";
import { useMe, useUpdateMe } from "@/hooks/useMe";

/* ── Read-only info row ── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-200">
      <span
        className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 md:text-base md:leading-[30px] shrink-0"
      >
        {label}
      </span>
      <span
        className="font-semibold tracking-[-0.02em] text-sm leading-7 md:text-base md:leading-[30px] text-right truncate ml-4"
        style={{ color: "#414651" }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

export default function Profile() {
  const { data: me, isLoading } = useMe();
  const { mutate: updateMe, isPending } = useUpdateMe();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const avatarSrc = me?.profilePhoto ? `${BASE_URL}/${me.profilePhoto}` : null;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setName(me?.name ?? "");
    setPhone(me?.phone ?? "");
    setEditing(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    updateMe(
      {
        name: name || undefined,
        phone: phone || undefined,
        profilePhoto: photo ?? undefined,
      },
      {
        onSuccess: () => {
          setEditing(false);
          setPhoto(null);
          setPreview(null);
        },
      },
    );
  };

  return (
    <UserLayout>
      <div className="flex flex-col w-full px-4 md:px-[120px] py-6 md:py-8 gap-5">
        {/* Tab switcher */}
        <ProfileTabs active="Profile" />

        {/* Page title */}
        <h1
          className="font-bold text-neutral-950 tracking-[-0.02em] text-[24px] leading-9 md:text-[28px] md:leading-[38px]"
        >
          Profile
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20 text-sm text-neutral-400">
            Loading profile...
          </div>
        ) : (
          <div
            className="flex flex-col gap-5 p-5 bg-white rounded-2xl w-full md:max-w-[600px] shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div
                  className="w-12 h-12 md:w-[60px] md:h-[60px] rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center font-bold *:text-neutral-600 text-lg"
                >
                  {preview || avatarSrc ? (
                    <img
                      src={preview ?? avatarSrc!}
                      alt={me?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    (me?.name?.[0]?.toUpperCase() ?? "U")
                  )}
                </div>

                {/* Camera button — only in edit mode */}
                {editing && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                    aria-label="Change photo"
                  >
                    <Camera className="w-3 h-3 text-white" strokeWidth={2} />
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* Info rows — read-only view */}
            {!editing && (
              <div className="flex flex-col">
                <InfoRow label="Name" value={me?.name ?? ""} />
                <InfoRow label="Email" value={me?.email ?? ""} />
                <InfoRow label="Nomor Handphone" value={me?.phone ?? ""} />
              </div>
            )}

            {/* Edit fields */}
            {editing && (
              <div className="flex flex-col gap-3">
                {/* Name */}
                <div className="flex flex-col gap-[2px]">
                  <label
                    className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
                  >
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 border border-neutral-300rounded-xl text-sm font-medium text-neutral-950 outline-none focus:border-primary transition-colors bg-white"
                  />
                </div>

                {/* Email — not editable per API */}
                <div className="flex flex-col gap-[2px]">
                  <label
                    className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
                  >
                    Email
                  </label>
                  <div
                    className="w-full h-12 px-4 flex items-center border border-neutral-200 rounded-xl bg-neutral-50"
                  >
                    <span
                      className="font-medium text-neutral-500 tracking-[-0.03em] text-sm leading-7"
                    >
                      {me?.email ?? ""}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-[2px]">
                  <label
                    className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
                  >
                    Nomor Handphone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 px-4 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-950 outline-none focus:border-primary transition-colors bg-white"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            {!editing ? (
              <button
                onClick={handleEdit}
                className="w-full h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-base leading-[30px] transition-colors"
              >
                Update Profile
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditing(false)}
                  className="flex-1 h-12 flex items-center justify-center rounded-full border border-neutral-300 font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px] hover:border-primary hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="flex-1 h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-base leading-[30px] disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </UserLayout>
  );
}

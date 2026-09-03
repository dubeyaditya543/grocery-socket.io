import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface AvatarPicProps {
  _id?: string,
  fullName: string,
  avatarUrl?: string | null
}

const AVATAR_COLORS = [
  "bg-rose-500 text-white",
  "bg-indigo-500 text-white",
  "bg-emerald-500 text-white",
  "bg-amber-500 text-white",
  "bg-sky-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
  "bg-teal-500 text-white",
];

function getAvatarColor(identifier: string = "") {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function AvatarPic({fullName, avatarUrl, _id}: AvatarPicProps) {
  return (
    <Avatar>
      <AvatarImage src={avatarUrl} alt="avatar" />
      <AvatarFallback className={getAvatarColor(fullName || _id)}>
        {fullName.charAt(0)?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

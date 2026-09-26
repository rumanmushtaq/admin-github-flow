import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  githubId: number;
  name: string;
  fullName: string;
  githubUrl: string;
  homepage: string | null;
  title: string;
  description: string;
  techStack: string[];
  category: string;
  thumbnail: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  githubStars: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    githubId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    githubUrl: { type: String, required: true },
    homepage: { type: String, default: null },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    category: {
      type: String,
      enum: ["Web App", "AI/ML", "Mobile", "Library", "Other"],
      default: "Other",
    },
    thumbnail: { type: String, default: null },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    githubStars: { type: Number, default: 0 },
    language: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);

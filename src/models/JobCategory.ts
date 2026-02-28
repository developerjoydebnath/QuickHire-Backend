import mongoose from 'mongoose';

const jobCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    icon_name: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const JobCategory = mongoose.model('JobCategory', jobCategorySchema);

export default JobCategory;

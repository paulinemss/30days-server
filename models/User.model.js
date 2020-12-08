const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    profilePic: {
      type: String,
      default: 'https://res.cloudinary.com/dffhi2onp/image/upload/v1606127208/Sans_titre_3_cfj8uo.png'
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    members: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "User",
  validate: {
    validator: function (v) {
      return v.length >= 1;
    },
    message: "Group must have at least one member"
  }
},

    inviteToken: {
      type: String,
      unique: true,
      index: true
    },

    inviteEnabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);

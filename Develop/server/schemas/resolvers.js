const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new Error("Not logged in!");
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      try {
        const user = await User.create({ username, email, password });
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        console.error("Error details:", error); // This will give a detailed error message
        throw new Error(error.message); // This will send a more specific error to the client
      }
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      // If there's no user in the context, throw an authentication error
      if (!context.user) {
        throw new AuthenticationError("You need to be logged in!");
      }

      // Find the user using their ID from the context
      const user = await User.findById(context.user._id);

      // If the user is not found, throw an error
      if (!user) {
        throw new AuthenticationError("Cannot find this user");
      }

      // Push the new book data into the user's savedBooks array
      user.savedBooks.push(bookData);

      // Save the user document with the updated savedBooks array
      await user.save();

      // Return the updated user
      return user;
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new Error("You need to be logged in!");
    },
  },
};

module.exports = resolvers;

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://pu5hp:qU5ZDnDjn9wE9kSS@cluster0.l8hqvdz.mongodb.net/paytm');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/');` if your database has auth enabled
}

const userSchema = new mongoose.Schema({
    username:{
      type: String,
      required:true,
      unique: true,
      trim:true,
      lowercase:true,
      
      maxLength:30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
  });

const User = mongoose.model('User',userSchema);

//balance schema

const accountSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: 'User',
      required: true
  },
  balance: {
      type: Number,
      required: true
  }
});

const Account = mongoose.model('Account', accountSchema);

export {User,Account};

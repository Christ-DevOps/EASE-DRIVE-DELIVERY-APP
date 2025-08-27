const User = require('../Models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


 console.log(process.env.JWT_SECRET, 'helloo');
    
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'client' } = req.body;

  
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Name, email, password, phone are required' });
 
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Cannot register as admin' });
    }

    const existMail = await User.findOne({email});
    if (existMail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existPhone =  await User.findOne({phone});
    if (existPhone) {
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    const payload = { name, email, phone, password, role };

    if (role === 'partner') {
      payload.partnerInfo = { companyName: req.body.companyName || '' };
      if (req.files?.partnerDocs) {
        payload.partnerInfo.documents = req.files.partnerDocs.map(f => f.path);
      }
    }

    if (role === 'delivery_agent') {
      payload.deliveryInfo = {
        vehicleType: req.body.vehicleType || '',
        licenseNumber: req.body.licenseNumber || ''
      };
      if (req.files?.deliveryDocs) {
        payload.deliveryInfo.documents = req.files.deliveryDocs.map(f => f.path);
      }
    }

    const user = await User.create(payload);
    const token = signToken(user._id, user.role);

    res.status(201).json({
      user: { id: user.id, name: user.email, phone: user.phone, role: user.role },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials retry again' });

    const token = signToken(user._id, user.role);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' }); 
  }
};

exports.profile = async (req, res) => {
  // protect middleware puts req.user
  res.json({ user: req.user });
};

exports.ResetPassword = async (req, res) => {
  try {
    const { email} = req.body;
    if(!email ){
      return resizeTo.status(400).json({ message: 'All fields are Required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const Otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.forgotPasswordCode = Otp;
    user.forgotPasswordExpiry = Date.now() + 10 * 60 * 100 // 10 minutes expiry
    await user.save();
    const token = signToken(user._id, user.role);
    // Here you would send the OTP to the user's email or phone
    console.log(`OTP for ${email}: ${Otp}`); // For demonstration, log it
    return res.status(200).json({ message: 'Otp Sent successfully' });

}catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.VerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email }).select('+forgotPasswordCode +forgotPasswordExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.forgotPasswordCode || user.forgotPasswordCode !== otp) {
      console.log(otp);
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (user.forgotPasswordExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    user.forgotPasswordCode = undefined; // Clear OTP after verification
    user.forgotPasswordExpiry = undefined; // Clear expiry after verification
    user.forgotPasswordCodeValidation = true; // Allow password reset
    await user.save();
    const token = signToken(user._id, user.role);
    return res.status(200).json({ message: 'OTP verified successfully', token }); 
}catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.SetNewPassword = async (req, res) => {
  try{
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'All Fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.forgotPasswordCodeValidation) {
      return res.status(400).json({ message: 'OTP not verified' });
    }
    user.password = newPassword; // Set new password
    user.forgotPasswordCode = undefined; // Clear OTP
    user.forgotPasswordExpiry = undefined; // Clear expiry

    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });

  }catch(err){
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
import React, { useState } from "react"

import { supabase } from "../../supabaseClient"

const SignIn = ({ onLoginSuccess, onNavigateToSignUp }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log("Login error:", error)

      if (error) {
        setError(error.message)
      } else {
        onLoginSuccess()
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Login</h1>
      <form
        onSubmit={handleLogin}
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
        }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: "100%",
              padding: "8px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          Login
        </button>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={onNavigateToSignUp}
            style={{
              background: 'none',
              border: 'none',
              color: '#4CAF50',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit',
              fontFamily: 'inherit',
            }}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignIn

// // SignIn.js
// import * as React from 'react';
// import {
//   Box,
//   Button,
//   Checkbox,
//   CssBaseline,
//   FormControlLabel,
//   Divider,
//   FormLabel,
//   FormControl,
//   Link,
//   TextField,
//   Typography,
//   Stack,
//   Card as MuiCard,
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import ForgotPassword from './ForgotPassword';
// import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
// // import AppTheme from '../shared-theme/AppTheme';
// // import ColorModeSelect from '../shared-theme/ColorModeSelect';

// const Card = styled(MuiCard)(({ theme }) => ({
//   // Your existing styles...
// }));

// const SignInContainer = styled(Stack)(({ theme }) => ({
//   // Your existing styles...
// }));

// export default function SignIn({ onLoginSuccess }) {
//   const [emailError, setEmailError] = React.useState(false);
//   const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
//   const [passwordError, setPasswordError] = React.useState(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
//   const [open, setOpen] = React.useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const validateInputs = () => {
//     let isValid = true;

//     if (!email || !/\S+@\S+\.\S+/.test(email)) {
//       setEmailError(true);
//       setEmailErrorMessage('Please enter a valid email address.');
//       isValid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMessage('');
//     }

//     if (!password || password.length < 6) {
//       setPasswordError(true);
//       setPasswordErrorMessage('Password must be at least 6 characters long.');
//       isValid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMessage('');
//     }

//     return isValid;
//   };

//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (validateInputs()) {
//       // Implement your authentication logic here.
//       // For example, make an API call to validate the user's credentials.
//       // If successful:
//       onLoginSuccess();
//     }
//   };

//   return (
//     // Remove AppTheme if not used
//     // <AppTheme {...props}>
//     <>
//       <CssBaseline enableColorScheme />
//       <SignInContainer direction="column" justifyContent="space-between">
//         {/* Remove ColorModeSelect if not used */}
//         {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
//         <Card variant="outlined">
//           <SitemarkIcon />
//           <Typography
//             component="h1"
//             variant="h4"
//             sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
//           >
//             Sign in
//           </Typography>
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             noValidate
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               width: '100%',
//               gap: 2,
//             }}
//           >
//             <FormControl>
//               <FormLabel htmlFor="email">Email</FormLabel>
//               <TextField
//                 error={emailError}
//                 helperText={emailErrorMessage}
//                 id="email"
//                 type="email"
//                 name="email"
//                 placeholder="your@email.com"
//                 autoComplete="email"
//                 autoFocus
//                 required
//                 fullWidth
//                 variant="outlined"
//                 color={emailError ? 'error' : 'primary'}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </FormControl>
//             <FormControl>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <FormLabel htmlFor="password">Password</FormLabel>
//                 <Link
//                   component="button"
//                   onClick={handleClickOpen}
//                   variant="body2"
//                   sx={{ alignSelf: 'baseline' }}
//                 >
//                   Forgot your password?
//                 </Link>
//               </Box>
//               <TextField
//                 error={passwordError}
//                 helperText={passwordErrorMessage}
//                 name="password"
//                 placeholder="••••••"
//                 type="password"
//                 id="password"
//                 autoComplete="current-password"
//                 required
//                 fullWidth
//                 variant="outlined"
//                 color={passwordError ? 'error' : 'primary'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </FormControl>
//             <FormControlLabel
//               control={<Checkbox value="remember" color="primary" />}
//               label="Remember me"
//             />
//             <ForgotPassword open={open} handleClose={handleClose} />
//             <Button type="submit" fullWidth variant="contained">
//               Sign in
//             </Button>
//             <Typography sx={{ textAlign: 'center' }}>
//               Don&apos;t have an account?{' '}
//               <Link href="#" variant="body2" sx={{ alignSelf: 'center' }}>
//                 Sign up
//               </Link>
//             </Typography>
//           </Box>
//           <Divider>or</Divider>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <Button
//               type="button"
//               fullWidth
//               variant="outlined"
//               onClick={() => alert('Sign in with Google')}
//               startIcon={<GoogleIcon />}
//             >
//               Sign in with Google
//             </Button>
//             <Button
//               type="button"
//               fullWidth
//               variant="outlined"
//               onClick={() => alert('Sign in with Facebook')}
//               startIcon={<FacebookIcon />}
//             >
//               Sign in with Facebook
//             </Button>
//           </Box>
//         </Card>
//       </SignInContainer>
//     </>
//     // </AppTheme>
//   );
// }

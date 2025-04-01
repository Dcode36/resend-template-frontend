import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

const ReadmeComponent = ({ darkMode }) => {
    return (
        <Container maxWidth="xlg" sx={{ mt: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    backgroundColor: darkMode ? '#333' : '#fff',
                    color: darkMode ? '#fff' : '#000'
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Resend Template Email
                </Typography>
                <Typography variant="body1" paragraph>
                    A simple package for sending emails using a template fetched from your backend API and sending it via the Resend API. This package allows dynamic variable substitution in your email templates.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5">Installation</Typography>
                <Typography variant="body1" paragraph>
                    To install this package, run:
                </Typography>
                <Box
                    component="pre"
                    sx={{
                        bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        color: darkMode ? '#dcdcdc' : '#000',
                        fontFamily: 'monospace',
                    }}
                >
                    npm install resend-template
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5">Usage</Typography>
                <Typography variant="h6" gutterBottom>Prerequisites</Typography>
                <Typography variant="body1">
                    Before using this package, ensure that:
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="You have a Resend account and API key." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="You can get it by signing up at Resend." />
                    </ListItem>
                </List>

                <Typography variant="h6">Import the sendTemplateEmail function</Typography>
                <Box
                    component="pre"
                    sx={{
                        bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        color: darkMode ? '#dcdcdc' : '#000',
                        fontFamily: 'monospace',
                    }}
                >
                    {`import { sendTemplateEmail } from 'resend-template';`}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5">Example Usage</Typography>
                <Box
                    component="pre"
                    sx={{
                        bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        color: darkMode ? '#dcdcdc' : '#000',
                        fontFamily: 'monospace',
                    }}
                >
                    {`const apiKey = 'your_resend_api_key';
const from = 'your-email@example.com'; // verified email address
const to = 'recipient@example.com';
const templateId = 'your-template-id';
const variables = {
  name: 'John Doe',
  subject: 'Welcome to Our Service',
};

sendTemplateEmail({ apiKey, from, to, templateId, variables })
  .then(response => console.log('Email sent successfully:', response))
  .catch(err => console.error('Error sending email:', err));`}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5">Template Structure</Typography>
                <Typography variant="body1" paragraph>
                    Your backend should have an endpoint that serves the template.
                </Typography>
                <Box
                    component="pre"
                    sx={{
                        bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        color: darkMode ? '#dcdcdc' : '#000',
                        fontFamily: 'monospace',
                    }}
                >
                    {`{
  "templateId": "welcome-email",
  "subject": "Welcome, {{name}}!",
  "html": "<h1>Hello {{name}},</h1><p>Welcome to our service! We are happy to have you onboard.</p>"
}`}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5">Configuration</Typography>
                <Typography variant="body1" paragraph>
                    The following parameters are required:
                </Typography>
                <List>
                    <ListItem><ListItemText primary="apiKey (string): Your Resend API key." /></ListItem>
                    <ListItem><ListItemText primary="from (string): The sender's email address." /></ListItem>
                    <ListItem><ListItemText primary="to (string): The recipient's email address." /></ListItem>
                    <ListItem><ListItemText primary="templateId (string): The ID of the template you want to use." /></ListItem>
                    <ListItem><ListItemText primary="variables (object): Variables to replace in the template." /></ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5">Demo</Typography>
                <Box
                    component="pre"
                    sx={{
                        bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        color: darkMode ? '#dcdcdc' : '#000',
                        fontFamily: 'monospace',
                    }}
                >
                    {`import { sendTemplateEmail } from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const testSendEmail = async () => {
  const response = await sendTemplateEmail({
    apiKey: process.env.RESEND_API_KEY,
    from: 'example@gmail.com',
    to: 'your-email@gmail.com',
    templateId: 'password-reset',
    variables: {
      subject: 'Password Reset Link : www.digivjay.kadam.com',
      name: "John Doe",
      reset_link: "https://yourwebsite.com/reset-password?token=xyz",
      year: "2025"
    }
  });

  console.log('Email Response:', response);
};

testSendEmail();`}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5">License</Typography>
                <Typography variant="body1">This project is licensed under the MIT License - see the LICENSE file for details.</Typography>
            </Paper>
        </Container>
    );
};

export default ReadmeComponent;

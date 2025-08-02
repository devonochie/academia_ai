import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateParaphrase, paraphraseDocument } from '../../features/paraphraser/paraphraserThunks';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SyntaxHighlighter from 'react-syntax-highlighter';
import '../../assets/styles/para.css';
import { motion } from 'framer-motion';
import {
  School,
  Article,
  FormatQuote,
  Balance,
  Palette,
  Science,
  AutoFixHigh,
  Send,
  ContentCopy,
  CheckCircle,
  Error,
  AttachFile,
  InsertDriveFile,
  Close
} from '@mui/icons-material';
import {
  Typography,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Container,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Tooltip,
  IconButton,
  Divider,
  Avatar,
  Alert,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFileInput = styled('div')(({ theme }) => ({
  border: '2px dashed',
  borderColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.dark,
  },
}));

const FilePreview = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
}));

const ParaphraserPage = () => {
    const dispatch = useDispatch();
    const [inputText, setInputText] = React.useState('');
    const [tone, setTone] = React.useState('formal');
    const { isLoading, errorMessage, paraphraseText, score,originalFilename } = useSelector((state) => state.paraphraser);
    const [creativity, setCreativity] = React.useState(50);
    const [history, setHistory] = React.useState([]);
    const [domain, setDomain] = React.useState('general');
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [isDocumentMode, setIsDocumentMode] = React.useState(false);

    const tones = [
        { value: 'formal', label: 'Formal', icon: <School /> },
        { value: 'professional', label: 'Professional', icon: <Article /> },
        { value: 'casual', label: 'Casual', icon: <FormatQuote /> },
        { value: 'persuasive', label: 'Persuasive', icon: <Balance /> },
        { value: 'creative', label: 'Creative', icon: <Palette /> },
        { value: 'technical', label: 'Technical', icon: <Science /> }
    ];

    const domains = [
        { value: 'general', label: 'General' },
        { value: 'academic', label: 'Academic' },
        { value: 'business', label: 'Business' },
        { value: 'legal', label: 'Legal' },
        { value: 'medical', label: 'Medical' },
        { value: 'technical', label: 'Technical' }
    ];

    const handleParaphrase = async () => {
        if (!inputText.trim() && !isDocumentMode) {
            alert("Please enter some text to paraphrase.");
            return;
        }

        if (isDocumentMode && !selectedFile) {
            alert("Please select a file to paraphrase.");
            return;
        }

        try {
            if (isDocumentMode) {
                dispatch(paraphraseDocument({
                    file: selectedFile,
                    options: {
                        tone: tone || 'formal',
                        creativity: creativity / 100 || 'medium',
                        domain: domain || 'general'
                    }
                }));
            } else {
                dispatch(generateParaphrase({
                    text: inputText,
                    tone: tone || 'formal',
                    creativity: creativity / 100 || 'medium',
                    domain: domain || 'general'
                }));
            }
        } catch (error) {
            console.error("Error generating paraphrase:", error);
        }

        // Save to history
        if (paraphraseText) {
            setHistory(prev => [
                {
                    input: isDocumentMode ? selectedFile.name : inputText,
                    output: paraphraseText,
                    tone,
                    domain,
                    score,
                    date: new Date().toISOString(),
                    isDocument: isDocumentMode
                },
                ...prev.slice(0, 4)
            ]);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setIsDocumentMode(true);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setIsDocumentMode(false);
    };

    const handleCopyToClipboard = () => {
        if (!paraphraseText) {
            alert("No paraphrase text available to copy.");
            return;
        }
        navigator.clipboard.writeText(paraphraseText)
            .then(() => {
                alert("Paraphrase text copied to clipboard!");
            })
            .catch((error) => {
                console.error("Failed to copy text:", error);
                alert("Failed to copy text. Please try again.");
            });
    };

    const handleExampleText = () => {
        const examples = [
            "The rapid advancement of artificial intelligence is transforming industries across the globe, creating both opportunities and challenges for workers.",
            "Climate change represents one of the most significant threats to biodiversity in the 21st century, with many species struggling to adapt to rapidly changing environmental conditions.",
            "In contractual agreements, the doctrine of substantial performance allows for partial fulfillment of obligations without constituting a complete breach of contract."
        ];
        const randomIndex = Math.floor(Math.random() * examples.length);
        setInputText(examples[randomIndex]);
        setIsDocumentMode(false);
        setSelectedFile(null);
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundAttachment: 'fixed',
            py: 4
        }}>
            <Container maxWidth="lg">
                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {errorMessage}
                    </Alert>
                )}

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={6} sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.97)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}>
                        {/* Header */}
                        <Box sx={{
                            p: 3,
                            background: 'linear-gradient(45deg, #4f46e5 0%, #7c3aed 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <Typography variant="h4" component="h1" sx={{
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <AutoFixHigh fontSize="large" /> Advanced Paraphraser
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleExampleText}
                                    startIcon={<FormatQuote />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Load Example
                                </Button>
                            </Box>
                        </Box>

                        {/* Main Content */}
                        <Box sx={{ p: 4 }}>
                            {/* Mode Selector */}
                            <Box sx={{ mb: 4 }}>
                                <Button
                                    variant={!isDocumentMode ? "contained" : "outlined"}
                                    onClick={() => setIsDocumentMode(false)}
                                    sx={{ mr: 2, borderRadius: 2 }}
                                >
                                    Text Input
                                </Button>
                                <Button
                                    variant={isDocumentMode ? "contained" : "outlined"}
                                    onClick={() => setIsDocumentMode(true)}
                                    startIcon={<AttachFile />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Document
                                </Button>
                            </Box>

                            {/* Input Section */}
                            {!isDocumentMode ? (
                                <TextField
                                    label="Original Text"
                                    multiline
                                    rows={8}
                                    fullWidth
                                    variant="outlined"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    sx={{ mb: 3 }}
                                    InputProps={{
                                        style: { borderRadius: 12 }
                                    }}
                                />
                            ) : (
                                <StyledFileInput>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                        accept=".txt,.pdf,.doc,.docx"
                                    />
                                    <label htmlFor="file-upload">
                                        <Button
                                            variant="contained"
                                            component="span"
                                            startIcon={<AttachFile />}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Choose File
                                        </Button>
                                    </label>
                                    <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                        Drag & drop a file here, or click to select
                                    </Typography>
                                    <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                                        Supported formats: .txt, .pdf, .doc, .docx
                                    </Typography>

                                    {selectedFile && (
                                        <FilePreview elevation={3}>
                                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                                <InsertDriveFile />
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1">{selectedFile.name}</Typography>
                                                <Typography variant="caption">
                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                </Typography>
                                            </Box>
                                            <IconButton onClick={removeFile}>
                                                <Close />
                                            </IconButton>
                                        </FilePreview>
                                    )}
                                </StyledFileInput>
                            )}

                            {/* Settings Section */}
                            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                    Paraphrase Settings
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                    <FormControl sx={{ minWidth: 180 }}>
                                        <InputLabel>Tone</InputLabel>
                                        <Select
                                            value={tone}
                                            label="Tone"
                                            onChange={(e) => setTone(e.target.value)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {tones.map((t) => (
                                                <MenuItem key={t.value} value={t.value}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {t.icon} {t.label}
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl sx={{ minWidth: 180 }}>
                                        <InputLabel>Domain</InputLabel>
                                        <Select
                                            value={domain}
                                            label="Domain"
                                            onChange={(e) => setDomain(e.target.value)}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            {domains.map((d) => (
                                                <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Box sx={{ width: 220 }}>
                                        <Typography variant="body2" gutterBottom>
                                            Creativity: {creativity}%
                                        </Typography>
                                        <Slider
                                            value={creativity}
                                            onChange={(e, val) => setCreativity(val)}
                                            min={10}
                                            max={100}
                                            step={5}
                                            valueLabelDisplay="auto"
                                            sx={{ color: 'primary.main' }}
                                        />
                                    </Box>
                                </Box>
                            </Paper>

                            {/* Action Button */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={handleParaphrase}
                                    disabled={isLoading || (isDocumentMode ? !selectedFile : !inputText.trim())}
                                    startIcon={isLoading ? <CircularProgress size={24} /> : <AutoFixHigh />}
                                    sx={{
                                        px: 6,
                                        py: 1.5,
                                        borderRadius: 3,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                                        '&:hover': {
                                            boxShadow: '0 6px 18px rgba(79, 70, 229, 0.4)'
                                        }
                                    }}
                                >
                                    {isLoading ? 'Processing...' : 'Paraphrase Now'}
                                </Button>
                            </Box>

                            {/* Output Section */}
                            {paraphraseText && (
                                <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">Paraphrased Result</Typography>
                                        {originalFilename && (
                                              <Typography variant="subtitle2" color="text.secondary">
                                                  From: {originalFilename}
                                              </Typography>
                                          )}
                                        <Tooltip title="Copy to clipboard">
                                            <IconButton onClick={handleCopyToClipboard} color="primary">
                                                <ContentCopy />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'grey.100' }}>
                                        <Typography component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {paraphraseText}
                                        </Typography>
                                    </Paper>

                                    {score !== null && (
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            mt: 3
                                        }}>
                                            <Typography variant="body1">
                                                Originality Score:
                                            </Typography>
                                            <Badge
                                                badgeContent={score < 30 ? "Excellent" : score < 60 ? "Good" : "Needs Work"}
                                                color={score < 30 ? "success" : score < 60 ? "warning" : "error"}
                                                sx={{ mr: 2 }}
                                            >
                                                <Chip
                                                    label={`${score}%`}
                                                    color={score < 30 ? "success" : score < 60 ? "warning" : "error"}
                                                    icon={score < 30 ? <CheckCircle /> : <Error />}
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{ px: 2, py: 1, fontSize: '1rem' }}
                                                />
                                            </Badge>
                                            <Typography variant="caption" color="text.secondary">
                                                (Higher is better)
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            )}

                            {/* History Section */}
                            {history.length > 0 && (
                                <>
                                    <Divider sx={{ my: 3 }} />
                                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                        Recent Paraphrases
                                    </Typography>
                                    <Box sx={{
                                        display: 'grid',
                                        gridTemplateColumns: { md: 'repeat(auto-fill, minmax(320px, 1fr))' },
                                        gap: 3
                                    }}>
                                        {history.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Paper elevation={3} sx={{ p: 2.5, height: '100%', borderRadius: 3 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            {new Date(item.date).toLocaleString()}
                                                        </Typography>
                                                        {item.isDocument && (
                                                            <Tooltip title="Document">
                                                                <InsertDriveFile color="action" fontSize="small" />
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                                        <Chip label={item.tone} size="small" variant="outlined" />
                                                        <Chip label={item.domain} size="small" variant="outlined" />
                                                        <Chip
                                                            label={`${item.score}%`}
                                                            size="small"
                                                            color={item.score < 30 ? 'success' : item.score < 60 ? 'warning' : 'error'}
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                    <Typography variant="body2" sx={{
                                                        mb: 2,
                                                        fontStyle: 'italic',
                                                        color: 'text.secondary',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}>
                                                        {item.input}
                                                    </Typography>
                                                    <SyntaxHighlighter
                                                        language="text"
                                                        style={atomDark}
                                                        customStyle={{
                                                            margin: 0,
                                                            borderRadius: 12,
                                                            fontSize: '0.8rem',
                                                            maxHeight: '120px',
                                                            overflow: 'auto'
                                                        }}
                                                    >
                                                        {item.output}
                                                    </SyntaxHighlighter>
                                                </Paper>
                                            </motion.div>
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Paper>
                </motion.div>

                {/* Footer */}
                <Box sx={{ mt: 4, textAlign: 'center', color: 'white' }}>
                    <Typography variant="body2">
                        Powered by Groq AI & Natural Language Processing
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default ParaphraserPage;
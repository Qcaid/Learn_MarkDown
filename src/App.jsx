import { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Container, Grid, Paper, Box, IconButton, Drawer, List, ListItem, ListItemText, Divider, Button, ButtonGroup, ThemeProvider, createTheme, Menu, MenuItem } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { jsPDF } from 'jspdf'

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return ''
  }
})

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      background: {
        default: '#1a1a1a',
        paper: '#2d2d2d'
      },
      text: {
        primary: '#ffffff',
        secondary: '#b3b3b3'
      }
    } : {})
  }
})

const markdownExamples = [
  {
    title: '基础语法',
    content: '# 标题示例\n\n这是一个**粗体**和*斜体*的示例\n\n- 列表项1\n- 列表项2\n\n1. 有序列表1\n2. 有序列表2\n\n> 这是一个引用\n\n---\n\n`行内代码` 示例\n\n```\n代码块示例\n```',
    description: '这个示例包含了最常用的Markdown语法元素，适合快速入门',
    practice: '尝试创建一个包含标题、列表和引用的简单文档'
  },

  {
    title: '列表',
    content: '- 无序列表项1\n- 无序列表项2\n\n1. 有序列表项1\n2. 有序列表项2',
    description: '使用 - 创建无序列表，使用数字加点创建有序列表'
  },
  {
    title: '强调',
    content: '**粗体文本**\n*斜体文本*\n***粗斜体文本***',
    description: '使用 * 或 _ 包围文本来添加强调，单个表示斜体，两个表示粗体，三个表示粗斜体'
  },
  {
    title: '链接和图片',
    content: '[链接文本](https://example.com)\n![图片描述](https://example.com/image.jpg)',
    description: '使用 [文本](URL) 创建链接，使用 ![描述](图片URL) 插入图片'
  },
  {
    title: '引用和代码',
    content: '> 这是一段引用文本\n\n`这是行内代码`\n\n```\n这是代码块\n```',
    description: '使用 > 创建引用，使用反引号(`) 包围代码，使用三个反引号创建代码块'
  },
  {
    title: '表格',
    content: '| 表头1 | 表头2 |\n| --- | --- |\n| 单元格1 | 单元格2 |\n| 单元格3 | 单元格4 |',
    description: '使用 | 分隔单元格，使用 - 分隔表头和内容，创建简单的表格'
  },
  {
    title: '任务列表',
    content: '- [x] 已完成任务\n- [ ] 未完成任务\n- [ ] 待办事项',
    description: '使用 - [ ] 创建待办事项，- [x] 表示已完成的任务'
  },
  {
    title: '脚注',
    content: '这里是一段带有脚注的文本[^1]\n\n[^1]: 这是脚注的内容',
    description: '使用 [^标签] 创建脚注引用，在文档底部使用 [^标签]: 添加脚注内容'
  },
  {
    title: '水平线',
    content: '---\n***\n___',
    description: '使用三个或更多的 -、* 或 _ 创建水平分隔线'
  },
  {
    title: '高级文本格式',
    content: '~~删除线文本~~\n==高亮文本==\n上标^2^\n下标~2~',
    description: '使用 ~~ 创建删除线，== 创建高亮，^ 创建上标，~ 创建下标（部分编辑器支持）'
  }
]

function App() {
  const [markdownText, setMarkdownText] = useState(() => {
    const saved = localStorage.getItem('markdownText')
    return saved || '# 欢迎使用Markdown学习网站\n\n这是一个交互式的Markdown学习平台，你可以在这里：\n\n1. 学习Markdown语法\n2. 实时预览编辑效果\n3. 完成练习题\n\n## 开始使用\n\n在左侧编辑器中输入Markdown文本，右侧将实时显示渲染效果。'
  })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode')
    return savedMode || 'light'
  })
  const [anchorEl, setAnchorEl] = useState(null)

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleExportClose = () => {
    setAnchorEl(null)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.html(document.querySelector('.markdown-preview'), {
      callback: function (pdf) {
        pdf.save('markdown-content.pdf')
      }
    })
    handleExportClose()
  }

  const exportToHTML = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Markdown Content</title>
        <style>
          body { max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif; }
        </style>
      </head>
      <body>
        ${md.render(markdownText)}
      </body>
      </html>
    `
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'markdown-content.html'
    a.click()
    URL.revokeObjectURL(url)
    handleExportClose()
  }

  useEffect(() => {
    localStorage.setItem('markdownText', markdownText)
  }, [markdownText])

  useEffect(() => {
    localStorage.setItem('themeMode', mode)
  }, [mode])

  const insertMarkdown = (syntax) => {
    setMarkdownText(prev => prev + '\n' + syntax)
  }

  const theme = getTheme(mode)

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Markdown学习网站
            </Typography>
            <Button
              color="inherit"
              onClick={handleExportClick}
              sx={{ mr: 2 }}
            >
              导出
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleExportClose}
            >
              <MenuItem onClick={exportToPDF}>导出为PDF</MenuItem>
              <MenuItem onClick={exportToHTML}>导出为HTML</MenuItem>
            </Menu>
            <IconButton
              color="inherit"
              onClick={() => setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')}
              sx={{ mr: 2 }}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
            <Button color="inherit" onClick={() => setDrawerOpen(true)}>
              教程
            </Button>
          </Toolbar>
        </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 400, p: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" gutterBottom>
            Markdown语法教程
          </Typography>
          <List>
            {markdownExamples.map((example, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText 
                    primary={example.title}
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {example.description}
                        </Typography>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => {
                            insertMarkdown(example.content)
                            setDrawerOpen(false)
                          }}
                        >
                          插入示例
                        </Button>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box sx={{ p: 2.5, height: 'calc(100vh - 64px)', bgcolor: 'background.default', overflow: 'hidden' }}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
                编辑器
              </Typography>
              <ButtonGroup variant="contained" size="small" sx={{ mb: 2.5, flexWrap: 'wrap', gap: 1, '& .MuiButton-root': { textTransform: 'none', px: 2, mb: 1 } }}>
                <Button onClick={() => insertMarkdown('# ')}>标题</Button>
                <Button onClick={() => insertMarkdown('## ')}>子标题</Button>
                <Button onClick={() => insertMarkdown('**粗体**')}>粗体</Button>
                <Button onClick={() => insertMarkdown('*斜体*')}>斜体</Button>
                <Button onClick={() => insertMarkdown('~~删除线~~')}>删除线</Button>
                <Button onClick={() => insertMarkdown('- ')}>无序列表</Button>
                <Button onClick={() => insertMarkdown('1. ')}>有序列表</Button>
                <Button onClick={() => insertMarkdown('- [ ] ')}>任务列表</Button>
                <Button onClick={() => insertMarkdown('> ')}>引用</Button>
                <Button onClick={() => insertMarkdown('```\n代码\n```')}>代码块</Button>
                <Button onClick={() => insertMarkdown('[链接文本](url)')}>链接</Button>
                <Button onClick={() => insertMarkdown('![图片描述](url)')}>图片</Button>
                <Button onClick={() => insertMarkdown('| 表头1 | 表头2 |\n| --- | --- |\n| 内容1 | 内容2 |')}>表格</Button>
              </ButtonGroup>
              <textarea
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                style={{
                  width: '100%',
                  flex: 1,
                  padding: '12px',
                  border: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e0e3e7'}`,
                  borderRadius: '8px',
                  resize: 'none',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary
                }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ height: '100%' }}>
            <Paper sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 600 }}>
                预览
              </Typography>
              <Box sx={{
                flex: 1,
                overflow: 'auto',
                bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#ffffff',
                borderRadius: '8px',
                p: 3,
                '@media (max-width: 600px)': {
                  p: 2,
                  '& pre': {
                    maxWidth: '100%',
                    overflowX: 'auto'
                  }
                },
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  background: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f1f1f1',
                  borderRadius: '4px'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme.palette.mode === 'dark' ? '#404040' : '#c1c1c1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' ? '#505050' : '#a8a8a8'
                  }
                },
                '& > div': {
                  height: '100%',
                  fontFamily: 'system-ui, sans-serif',
                  lineHeight: 1.7,
                  color: theme.palette.mode === 'dark' ? 'text.primary' : '#2c3e50',
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    marginTop: '1.5em',
                    marginBottom: '0.75em',
                    lineHeight: 1.3,
                    color: theme.palette.mode === 'dark' ? 'text.primary' : '#1a202c',
                    fontWeight: 600
                  },
                  '& p': {
                    marginBottom: '1.25em'
                  },
                  '& ul, & ol': {
                    paddingLeft: '2em',
                    marginBottom: '1.25em'
                  },
                  '& code': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#f1f5f9',
                    padding: '0.2em 0.4em',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    color: theme.palette.mode === 'dark' ? '#e2e8f0' : '#475569'
                  },
                  '& table': {
                    borderCollapse: 'collapse',
                    width: '100%',
                    marginBottom: '1.25em',
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e0e3e7'}`,
                    '& th, & td': {
                      border: `1px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e0e3e7'}`,
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '0.95em',
                      lineHeight: '1.4'
                    },
                    '& th': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f8fafc',
                      fontWeight: 600,
                      borderBottom: `2px solid ${theme.palette.mode === 'dark' ? '#505050' : '#cbd5e1'}`
                    },
                    '& tr:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#f8fafc'
                    }
                  },
                  '& pre': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#404040' : '#f1f5f9',
                    padding: '1em',
                    borderRadius: '4px',
                    overflow: 'auto',
                    marginBottom: '1.25em'
                  },
                  '& blockquote': {
                    borderLeft: `4px solid ${theme.palette.mode === 'dark' ? '#404040' : '#e2e8f0'}`,
                    margin: '1.5em 0',
                    paddingLeft: '1.25em',
                    color: theme.palette.mode === 'dark' ? 'text.secondary' : '#475569',
                    fontStyle: 'italic'
                  }
                }
              }}>
                <div 
                  className="markdown-preview"
                  dangerouslySetInnerHTML={{ __html: md.render(markdownText) }}
                  style={{
                    maxWidth: '800px',
                    margin: '0 auto'
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      </Box>
    </ThemeProvider>
  )
} // 组件结束括号

export default App;

'use client'

import { contentConfigs, type ContentType, generateFilename, generateMarkdown } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'

export default function ContentCreator() {
  const [selectedType, setSelectedType] = useState<ContentType>('post')
  const [formData, setFormData] = useState<Record<string, string | string[]>>({})
  const [content, setContent] = useState('')
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [previewMd, setPreviewMd] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTravelAlbum = selectedType === 'travel-album'

  const currentConfig = contentConfigs[selectedType]

  // Generate real-time preview markdown
  useEffect(() => {
    const md = generateMarkdown(selectedType, formData, content)
    setPreviewMd(md)
  }, [selectedType, formData, content, currentConfig])

  // Simple markdown to HTML converter
  function markdownToHtml(md: string): string {
    let html = md
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 rounded p-3 my-2 overflow-x-auto"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-600 hover:underline" target="_blank" rel="noopener">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2" />')
      // Unordered lists
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="my-2">')
      // Line breaks
      .replace(/\n/g, '<br />')

    // Wrap in paragraph
    html = `<p class="my-2">${html}</p>`

    // Clean up empty paragraphs
    html = html.replace(/<p class="my-2"><\/p>/g, '')
    html = html.replace(/<p class="my-2"><br \/>/g, '<p class="my-2">')

    return html
  }

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach(url => URL.revokeObjectURL(url))
    }
  }, [imageUrls])

  // Set defaults when type changes
  useEffect(() => {
    const defaults: Record<string, string> = {}
    currentConfig.fields.forEach((field) => {
      if (field.default) {
        defaults[field.key] = field.default
      }
    })
    setFormData(defaults)
    setContent('')
  }, [selectedType, currentConfig])

  function handleFieldChange(key: string, value: string) {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>, key: string) {
    const file = event.target.files?.[0]
    if (!file)
      return

    // Use object URL instead of base64 to save memory
    const objectUrl = URL.createObjectURL(file)
    setImageUrls(prev => ({ ...prev, [key]: objectUrl }))
    setFormData(prev => ({ ...prev, [key]: objectUrl }))
  }

  function handleMultipleImageUpload(event: React.ChangeEvent<HTMLInputElement>, key: string) {
    const files = Array.from(event.target.files || [])
    if (files.length === 0)
      return

    setIsUploading(true)

    const newUrls: string[] = []
    let processed = 0

    files.forEach((file, index) => {
      const objectUrl = URL.createObjectURL(file)
      newUrls[index] = objectUrl

      processed++
      if (processed === files.length) {
        setImageUrls(prev => ({ ...prev, [key]: newUrls[0] })) // Keep first URL reference
        setFormData((prev) => {
          const existing = prev[key]
          const existingArray = Array.isArray(existing) ? existing : existing ? [existing] : []
          return { ...prev, [key]: [...existingArray, ...newUrls] }
        })
        setIsUploading(false)
      }
    })
  }

  function removeImage(key: string, index: number) {
    setFormData((prev) => {
      const existing = prev[key]
      if (!Array.isArray(existing))
        return prev
      const newArray = existing.filter((_, i) => i !== index)
      return { ...prev, [key]: newArray }
    })
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(previewMd)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    catch {
      // silent fail
    }
  }

  async function saveFile() {
    // Prevent duplicate submissions
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Validate required fields
    const missingFields = currentConfig.fields
      .filter(field => field.required && !formData[field.key])
      .map(field => field.label)

    if (missingFields.length > 0) {
      setToast({ message: `请填写必填字段: ${missingFields.join(', ')}`, type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setSaveStatus('saving')

    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedType, fields: formData, content }),
      })

      const result = await response.json()

      if (result.success) {
        setSaveStatus('success')
        setToast({ message: '保存成功', type: 'success' })
        saveTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle')
          setToast(null)
        }, 2000)
      }
      else {
        throw new Error(result.error)
      }
    }
    catch {
      setSaveStatus('error')
      setToast({ message: '保存失败，请重试', type: 'error' })
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle')
        setToast(null)
      }, 3000)
    }
  }

  function downloadFile() {
    const md = generateMarkdown(selectedType, formData, content)
    const filename = generateFilename(selectedType, formData)
    if (!filename)
      return // Skip for travel-album
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 px-6 flex items-center border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Rex Wang</span>
        </div>

        {/* Action buttons in navbar */}
        <div className="flex-1 flex justify-end gap-2">
          {/* 预览按钮 - 旅行相册不显示 */}
          {!isTravelAlbum && (
            <button
              onClick={() => setShowPreview(prev => !prev)}
              className={`w-20 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm ${
                showPreview ? 'bg-purple-100 dark:bg-purple-900 text-purple-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>👁️</span>
              {' '}
              {showPreview ? '关闭' : '预览'}
            </button>
          )}
          <button
            onClick={saveFile}
            disabled={saveStatus === 'saving' || isUploading}
            className="w-20 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-60"
          >
            <span>{saveStatus === 'saving' ? '⏳' : '💾'}</span>
            {' '}
            {saveStatus === 'saving' ? '保存中' : '保存'}
          </button>
          {/* 下载按钮 - 旅行相册不显示 */}
          {!isTravelAlbum && (
            <button
              onClick={downloadFile}
              className="w-20 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <span>📥</span>
              {' '}
              下载
            </button>
          )}
          {/* 复制按钮 - 旅行相册不显示 */}
          {!isTravelAlbum && (
            <button
              onClick={copyToClipboard}
              className="w-20 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1 text-sm"
            >
              <span>{copied ? '✅' : '📋'}</span>
              {' '}
              {copied ? '已复制' : '复制'}
            </button>
          )}
        </div>

        <nav className="flex items-center gap-1 ml-4">
          <a href="https://github.com/OnlyProbie" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg opacity-60 hover:opacity-100 transition-opacity">
            GitHub
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 mx-auto mt-16">
        {/* Middle - Form */}
        <div className="flex-1 w-[900px]">
          <div key={selectedType} className="max-w-[700px] mx-auto">
            {/* Type selector at top of form */}
            <div className="flex gap-2 mb-6 flex-wrap pt-5">
              {Object.entries(contentConfigs).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as ContentType)}
                  className={`w-25 py-2 rounded-lg border font-medium transition-all text-sm ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-gradient text-white border-transparent'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-purple-500'
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentConfig.fields
                  .filter((field) => {
                    // 旅行相册以外的其他类型，隐藏 date 字段（使用默认日期）
                    if (!isTravelAlbum && field.key === 'date') {
                      return false
                    }
                    return true
                  })
                  .map(field => (
                    <div key={field.key} className={`flex flex-col gap-2 ${field.type === 'textarea' || field.type === 'image' || field.type === 'images' ? 'md:col-span-2' : ''}`}>
                      <label className="text-sm font-medium">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.type === 'select'
                        ? (
                            <select
                              value={formData[field.key] || ''}
                              onChange={e => handleFieldChange(field.key, e.target.value)}
                              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-purple-500"
                            >
                              <option value="">请选择</option>
                              {field.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          )
                        : field.type === 'textarea'
                          ? (
                              <textarea
                                value={formData[field.key] || ''}
                                onChange={e => handleFieldChange(field.key, e.target.value)}
                                rows={3}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-purple-500 resize-none"
                              />
                            )
                          : field.type === 'image'
                            ? (
                                <div className="flex flex-wrap gap-2 items-center">
                                  {formData[field.key] && typeof formData[field.key] === 'string'
                                    ? (
                                        <div className="relative w-24 h-20">
                                          <img
                                            src={formData[field.key] as string}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg border"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, [field.key]: '' }))}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      )
                                    : (
                                        <label className="cursor-pointer inline-flex w-24 h-20 items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 transition-colors">
                                          <span>📤</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleImageUpload(e, field.key)}
                                            className="hidden"
                                          />
                                        </label>
                                      )}
                                </div>
                              )
                            : field.type === 'images'
                              ? (
                                  <div className="flex flex-wrap gap-2 items-center">
                                    {Array.isArray(formData[field.key]) && (formData[field.key] as string[]).map((src, idx) => (
                                      <div key={idx} className="relative w-24 h-20">
                                        <img
                                          src={src}
                                          alt={`Preview ${idx + 1}`}
                                          className="w-full h-full object-cover rounded-lg border"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => removeImage(field.key, idx)}
                                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                    {isUploading && (
                                      <div className="w-24 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <span>上传中...</span>
                                      </div>
                                    )}
                                    <label className="cursor-pointer inline-flex w-24 h-20 items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 transition-colors">
                                      <span>📤</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={e => handleMultipleImageUpload(e, field.key)}
                                        className="hidden"
                                      />
                                    </label>
                                  </div>
                                )
                              : (
                                  <input
                                    type={field.type}
                                    value={formData[field.key] || ''}
                                    onChange={e => handleFieldChange(field.key, e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-purple-500"
                                  />
                                )}
                    </div>
                  ))}
              </div>

              {/* Content input - hidden for travel-album */}
              {!isTravelAlbum && (
                <div className="mb-6">
                  <label className="text-sm font-medium block mb-2">
                    {selectedType === 'daily' ? '碎记内容' : '正文内容 (Markdown)'}
                  </label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={12}
                    placeholder={selectedType === 'daily' ? '输入碎记内容，支持 Markdown 格式...' : '输入正文内容，支持 Markdown 格式...'}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:border-purple-500 resize-y font-mono text-sm"
                  />
                </div>
              )}
              {!isTravelAlbum && (
                <span className="ml-auto text-sm text-gray-500 self-center">
                  保存路径：
                  {currentConfig.directory}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Preview Panel - hidden for travel-album */}
      {!isTravelAlbum && (
        <div
          className={`fixed top-16 right-0 w-100 h-[calc(100vh-4rem)] overflow-auto border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 transition-transform duration-300 ease-in-out ${
            showPreview ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-3">实时预览</h3>
          <div
            className="text-sm text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(previewMd) }}
          />
        </div>
      )}

      {/* Toast Notification - with different styles for success/error */}
      {toast && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-sm text-white ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

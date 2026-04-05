import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import {
  isValidPackageName,
  toValidPackageName,
  emptyDir,
  copy,
  copyDir,
  editFile,
} from '../../src/utils.js'

describe('isValidPackageName - Edge Cases', () => {
  it('should reject names with special characters', () => {
    expect(isValidPackageName('my-app!')).toBe(false)
    expect(isValidPackageName('my#app')).toBe(false)
    expect(isValidPackageName('my$app')).toBe(false)
    expect(isValidPackageName('my%app')).toBe(false)
    expect(isValidPackageName("my'app")).toBe(false)
    expect(isValidPackageName('my"app')).toBe(false)
    expect(isValidPackageName('my&app')).toBe(false)
    expect(isValidPackageName('my*app')).toBe(false)
  })

  it('should reject names with unicode/accented characters', () => {
    expect(isValidPackageName('my-appão')).toBe(false)
    expect(isValidPackageName('café')).toBe(false)
    expect(isValidPackageName('日本語')).toBe(false)
    expect(isValidPackageName('моё')).toBe(false)
  })

  it('should accept names with consecutive hyphens', () => {
    expect(isValidPackageName('my--app')).toBe(true)
    expect(isValidPackageName('my---app')).toBe(true)
  })

  it('should accept names with leading hyphen (regex allows it)', () => {
    expect(isValidPackageName('-my-app')).toBe(true)
    expect(isValidPackageName('-app')).toBe(true)
  })

  it('should accept names with tilde', () => {
    expect(isValidPackageName('my~app')).toBe(true)
    expect(isValidPackageName('app~v1')).toBe(true)
  })

  it('should reject names with parentheses or brackets', () => {
    expect(isValidPackageName('my(app)')).toBe(false)
    expect(isValidPackageName('my[app]')).toBe(false)
    expect(isValidPackageName('my{app}')).toBe(false)
  })

  it('should reject names with forward slash in wrong position', () => {
    expect(isValidPackageName('my/app')).toBe(false)
    expect(isValidPackageName('app/test')).toBe(false)
  })

  it('should accept very long names', () => {
    const longName = 'a'.repeat(214)
    expect(isValidPackageName(longName)).toBe(true)
  })
})

describe('toValidPackageName - Edge Cases', () => {
  it('should handle multiple consecutive invalid characters', () => {
    expect(toValidPackageName('my@#!app')).toBe('my-app')
    expect(toValidPackageName('my!@#$%app')).toBe('my-app')
  })

  it('should handle mixed valid and invalid characters', () => {
    expect(toValidPackageName('My_App-123')).toBe('my-app-123')
    expect(toValidPackageName('Test@v1.0.0')).toBe('test-v1-0-0')
  })

  it('should collapse multiple spaces to single hyphen', () => {
    expect(toValidPackageName('app   name')).toBe('app-name')
    expect(toValidPackageName('a  b  c')).toBe('a-b-c')
  })

  it('should handle tabs and newlines', () => {
    expect(toValidPackageName('app\tname')).toBe('app-name')
    expect(toValidPackageName('app\nname')).toBe('app-name')
  })

  it('should remove trailing hyphens from invalid chars', () => {
    expect(toValidPackageName('my@')).toBe('my-')
    expect(toValidPackageName('my!@#')).toBe('my-')
  })

  it('should handle already valid names', () => {
    expect(toValidPackageName('my-app')).toBe('my-app')
    expect(toValidPackageName('my_app')).toBe('my-app')
  })

  it('should handle single character input', () => {
    expect(toValidPackageName('a')).toBe('a')
    expect(toValidPackageName('A')).toBe('a')
    expect(toValidPackageName('@')).toBe('-')
  })

  it('should handle only numbers', () => {
    expect(toValidPackageName('123')).toBe('123')
    expect(toValidPackageName('1 2 3')).toBe('1-2-3')
  })
})

describe('emptyDir', () => {
  const testDir = path.join(__dirname, '../tmp/emptyDir-test')

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
    fs.mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
  })

  it('should do nothing for non-existent directory', () => {
    fs.rmSync(testDir, { recursive: true })
    expect(() => emptyDir(testDir)).not.toThrow()
  })

  it('should remove all files except .git', () => {
    fs.writeFileSync(path.join(testDir, 'file1.txt'), 'content1')
    fs.writeFileSync(path.join(testDir, 'file2.txt'), 'content2')
    fs.mkdirSync(path.join(testDir, '.git'))
    
    emptyDir(testDir)
    
    expect(fs.existsSync(path.join(testDir, 'file1.txt'))).toBe(false)
    expect(fs.existsSync(path.join(testDir, 'file2.txt'))).toBe(false)
    expect(fs.existsSync(path.join(testDir, '.git'))).toBe(true)
  })

  it('should remove nested directories', () => {
    fs.mkdirSync(path.join(testDir, 'nested'), { recursive: true })
    fs.writeFileSync(path.join(testDir, 'nested', 'file.txt'), 'content')
    
    emptyDir(testDir)
    
    expect(fs.existsSync(path.join(testDir, 'nested'))).toBe(false)
  })

  it('should handle directory with only .git', () => {
    fs.mkdirSync(path.join(testDir, '.git'))
    emptyDir(testDir)
    expect(fs.existsSync(path.join(testDir, '.git'))).toBe(true)
  })
})

describe('copy', () => {
  const testDir = path.join(__dirname, '../tmp/copy-test')
  const srcDir = path.join(testDir, 'src')
  const destDir = path.join(testDir, 'dest')

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
    fs.mkdirSync(srcDir, { recursive: true })
  })

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
  })

  it('should copy a single file', () => {
    const srcFile = path.join(srcDir, 'test.txt')
    const destFile = path.join(destDir, 'test.txt')
    fs.writeFileSync(srcFile, 'test content')
    fs.mkdirSync(destDir, { recursive: true })
    
    copy(srcFile, destFile)
    
    expect(fs.existsSync(destFile)).toBe(true)
    expect(fs.readFileSync(destFile, 'utf-8')).toBe('test content')
  })

  it('should copy a directory recursively', () => {
    fs.mkdirSync(path.join(srcDir, 'subdir'), { recursive: true })
    fs.writeFileSync(path.join(srcDir, 'file1.txt'), 'content1')
    fs.writeFileSync(path.join(srcDir, 'subdir', 'file2.txt'), 'content2')
    
    copy(srcDir, destDir)
    
    expect(fs.existsSync(path.join(destDir, 'file1.txt'))).toBe(true)
    expect(fs.existsSync(path.join(destDir, 'subdir', 'file2.txt'))).toBe(true)
  })
})

describe('copyDir', () => {
  const testDir = path.join(__dirname, '../tmp/copyDir-test')
  const srcDir = path.join(testDir, 'src')
  const destDir = path.join(testDir, 'dest')

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
    fs.mkdirSync(srcDir, { recursive: true })
  })

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
  })

  it('should create destination directory if not exists', () => {
    copyDir(srcDir, destDir)
    expect(fs.existsSync(destDir)).toBe(true)
  })

  it('should copy all files from source directory', () => {
    fs.writeFileSync(path.join(srcDir, 'a.txt'), 'a')
    fs.writeFileSync(path.join(srcDir, 'b.txt'), 'b')
    
    copyDir(srcDir, destDir)
    
    expect(fs.existsSync(path.join(destDir, 'a.txt'))).toBe(true)
    expect(fs.existsSync(path.join(destDir, 'b.txt'))).toBe(true)
  })

  it('should handle nested directory structure', () => {
    fs.mkdirSync(path.join(srcDir, 'level1', 'level2', 'level3'), { recursive: true })
    fs.writeFileSync(path.join(srcDir, 'level1', 'level2', 'level3', 'deep.txt'), 'deep')
    
    copyDir(srcDir, destDir)
    
    expect(fs.existsSync(path.join(destDir, 'level1', 'level2', 'level3', 'deep.txt'))).toBe(true)
  })

  it('should overwrite existing files', () => {
    fs.mkdirSync(destDir, { recursive: true })
    fs.writeFileSync(path.join(srcDir, 'file.txt'), 'new content')
    fs.writeFileSync(path.join(destDir, 'file.txt'), 'old content')
    
    copyDir(srcDir, destDir)
    
    expect(fs.readFileSync(path.join(destDir, 'file.txt'), 'utf-8')).toBe('new content')
  })
})

describe('editFile', () => {
  const testDir = path.join(__dirname, '../tmp/editFile-test')
  const testFile = path.join(testDir, 'test.txt')

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
    fs.mkdirSync(testDir, { recursive: true })
    fs.writeFileSync(testFile, 'original content')
  })

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
  })

  it('should read and modify file content', () => {
    editFile(testFile, (content) => content.toUpperCase())
    expect(fs.readFileSync(testFile, 'utf-8')).toBe('ORIGINAL CONTENT')
  })

  it('should append content to file', () => {
    editFile(testFile, (content) => `${content}\nnew line`)
    const result = fs.readFileSync(testFile, 'utf-8')
    expect(result).toBe('original content\nnew line')
  })

  it('should handle empty files', () => {
    fs.writeFileSync(testFile, '')
    editFile(testFile, (content) => content || 'default')
    expect(fs.readFileSync(testFile, 'utf-8')).toBe('default')
  })

  it('should handle special characters in content', () => {
    editFile(testFile, (content) => content.replace('original', 'modified'))
    expect(fs.readFileSync(testFile, 'utf-8')).toBe('modified content')
  })
})

import { test, expect } from '@playwright/test';

const YAML = `apiVersion: v1
kind: ConfigMap
metadata:
  name: 'playwright-test-configmap'
  namespace: default
  annotations: {
    ready: 'true'
  }
  labels: {
    hello: world
  }
data: {
  timezone: Asia/Shanghai
}
`

test.describe('CRUD', () => {
  test('create resource', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByRole('link', { name: 'ConfigMaps' }).click();
    await page.getByRole('button', { name: '创建' }).click();
    const monacoEditor = page.locator(".monaco-editor").nth(0);
    await monacoEditor.click();
    await page.keyboard.press("Meta+KeyA")
    await page.keyboard.insertText(YAML);
  
    await page.getByRole('button', { name: '保存' }).click();
    await page.getByText('创建时间').click();
    await page.getByText('创建时间').click();
  
    await expect(page.getByRole('button', { name: 'playwright-test-configmap' })).toBeVisible();
    await page.getByRole('button', { name: 'playwright-test-configmap' }).click();
    
    await expect(page.getByText('timezone:Asia/Shanghai')).toBeVisible();
    await expect(page.getByText('hello:world')).toBeVisible();
    await expect(page.getByText('ready:true')).toBeVisible();
  });
  
  test('edit resource', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByRole('link', { name: 'ConfigMaps' }).click();
  
    await page.getByText('创建时间').click();
    await page.getByText('创建时间').click();
    await page.getByRole('button', { name: 'playwright-test-configmap' }).click();
    await page.getByRole('button').click();
    await page.getByText('编辑').click();
    await page.getByRole('code').locator('div').filter({ hasText: 'hello: world' }).nth(4).click();
    await page.getByLabel('Editor content;Press Alt+F1 for Accessibility Options.').fill('metadata:\n  name: playwright-test-configmap\n  namespace: default\n  labels:\n    hello: dovetail\n  annotations:\n    ready: \'true\'\n');
    await page.getByRole('button', { name: '保存' }).click();
    await page.getByText('创建时间').click();
    await page.getByText('创建时间').click();
    await page.getByRole('button', { name: 'playwright-test-configmap' }).click();
    
    await expect(page.getByText('hello:dovetail')).toBeVisible();
  });
  
  test('delete resource', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getByRole('link', { name: 'ConfigMaps' }).click();
  
    await page.getByText('创建时间').click();
    await page.getByText('创建时间').click();
    await page.getByRole('button', { name: 'playwright-test-configmap' }).click();
    await page.getByRole('button').click();
    await page.getByText('删除').click();
    await page.getByRole('button', { name: '删除' }).click();
    
    await page.reload();
    await page.getByText('创建时间').click();
    await page.getByText('创建时间').click();
  
    await expect(page.getByRole('button', { name: 'playwright-test-configmap' })).toBeHidden();
  });
});
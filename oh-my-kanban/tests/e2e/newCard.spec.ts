
import { test, expect } from '@playwright/test';

test('添加新卡片并移到进行中', async ({ page }) => {
  // 1. 用户打开看板应用
  await page.goto('http://localhost:3000');

  // 2. 用户添加新卡片
  // 2.1 点击“添加新卡片”
  const todoListColumn = page.locator('data-testid=kanban-column', {hasText: '待处理'});
  const showAddNewButton = todoListColumn.getByText(/添加新卡片/);
  await showAddNewButton.click();

  // 2.2 输入新卡片
  const addNewCard = todoListColumn.locator('li').first();
  await expect(addNewCard).toContainText('添加新卡片');
  const newCardTitleText = addNewCard.locator('input');
  await expect(newCardTitleText).toBeFocused();
  await newCardTitleText.type('测试E2E任务-1');
  await newCardTitleText.press('Enter');
  
  // 2.3 断言新卡片
  const newCard = todoListColumn.locator('li').first();
  await expect(newCard).toContainText('测试E2E任务-1');

  // 3. 用户将新添加的卡片拖拽到“进行中”看板列
  const ongoingListColumn = page.locator('section', { hasText: '进行中' });
  await newCard.dragTo(ongoingListColumn);
  await expect(todoListColumn.locator('li').first()).not.toContainText('测试E2E任务-1');
  await expect(ongoingListColumn.locator('li').first()).toContainText('测试E2E任务-1');

  // 4. 用户点击保存所有卡片
  const saveAllButton = page.getByText('保存所有卡片');
  await saveAllButton.click();

  // 5. 用户刷新浏览器
  await page.reload();
  await expect(ongoingListColumn.locator('li').first()).toContainText('测试E2E任务-1');
});
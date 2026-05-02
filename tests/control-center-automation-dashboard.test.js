const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'automation', 'Code.gs'), 'utf8');
const sidebar = fs.readFileSync(path.join(root, 'automation', 'SettingsSidebar.html'), 'utf8');

function contains(source, text, label) {
  assert(
    source.includes(text),
    `${label} should include: ${text}`
  );
}

contains(code, 'function syncWeeklyLabTriggerFromControlCenter', 'Code.gs');
contains(code, 'function scheduledWeeklyLabTrigger', 'Code.gs');
contains(code, 'function createEmailFinalReportDraft', 'Code.gs');
contains(code, 'function hasExistingWeeklyLabRunForIssueDate_', 'Code.gs');
contains(code, "setting_key: 'weekly_lab_run_day'", 'default preferences');
contains(code, "setting_key: 'weekly_lab_run_hour'", 'default preferences');
contains(code, 'email_html_draft', 'final output type options');
contains(code, 'ScriptApp.newTrigger', 'Apps Script trigger installer');
contains(code, 'MailApp.sendEmail', 'approved email sender');
contains(code, 'htmlBody', 'approved email sender html body');
contains(code, 'operation_verdict', 'Control Center operation home');
contains(code, 'latest_visualization_count', 'Control Center operation home');
contains(code, 'function recoverLatestWeeklyLabRunStatus', 'stale running run recovery');
contains(code, 'latest_remaining_steps', 'Control Center progress detail');

contains(sidebar, '운영 홈', 'Control Center sidebar');
contains(sidebar, 'Apps Script 예약 적용', 'Control Center sidebar');
contains(sidebar, '이메일용 HTML 최종본 만들기', 'Control Center sidebar');
contains(sidebar, '운영 판정', 'Control Center sidebar');
contains(sidebar, '자동 시각화', 'Control Center sidebar');
contains(sidebar, '멈춘 실행 마감', 'Control Center sidebar');
contains(sidebar, '남은 작업', 'Control Center sidebar');
contains(sidebar, "runServer('syncWeeklyLabTriggerFromControlCenter'", 'Control Center sidebar');
contains(sidebar, "runServer('createEmailFinalReportDraft'", 'Control Center sidebar');
contains(sidebar, "runServer('recoverLatestWeeklyLabRunStatus'", 'Control Center sidebar');

console.log('control center automation dashboard contract ok');

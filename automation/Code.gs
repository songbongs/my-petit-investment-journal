/**
 * SSMK investment journal automation draft.
 *
 * This Apps Script is designed for a learning journal, not investment advice.
 * It prepares Google Sheets data, builds AI prompt drafts, schedules hypothesis
 * reviews, and records review-board checks. Email sending and important
 * automation changes remain blocked until a human explicitly approves them.
 */

const SSMK = {
  projectName: 'SSMK 투자 관찰노트',
  timezone: 'Asia/Seoul',
  disclaimer: '투자 권유가 아닌 투자 공부용 관찰 기록입니다.',
  sheets: {
    settings: 'settings',
    watchlist: 'watchlist',
    weeklyScores: 'weekly_scores',
    scoreHistory: 'score_history',
    industryNotes: 'industry_notes',
    reportQueue: 'report_queue',
    recipients: 'recipients',
    newsEvents: 'news_events',
    dataSources: 'data_sources',
    hypothesisReviews: 'hypothesis_reviews',
    reportRuns: 'report_runs',
    automationStageReviews: 'automation_stage_reviews',
    changeApprovalLog: 'change_approval_log',
    agentReviewLog: 'agent_review_log',
  },
  headers: {
    watchlist: [
      'ticker',
      'company',
      'core_industry',
      'theme_tags',
      'investment_style',
      'role_in_watchlist',
      'tracking_priority',
      'dividend_focus',
      'business_model_focus',
      'key_metrics_to_watch',
      'main_events_to_watch',
      'active',
      'notes',
    ],
    weeklyScores: [
      'issue_date',
      'week_start',
      'ticker',
      'company',
      'core_industry',
      'theme_tags',
      'investment_style',
      'core_score',
      'shareholder_return_score',
      'industry_score',
      'business_model_score',
      'valuation_timing_score',
      'insider_event_score',
      'ssmk_total_score',
      'observation_grade',
      'previous_score',
      'score_change',
      'data_confidence',
      'uncertainty_level',
      'risk_flag',
      'hypothesis_summary',
      'evidence_metrics',
      'reasoning_explanation',
      'beginner_lesson',
      'limitations',
      'next_check',
      'source_links',
      'review_status',
    ],
    hypothesisReviews: [
      'hypothesis_id',
      'issue_date',
      'review_date',
      'review_window',
      'ticker',
      'company',
      'core_industry',
      'hypothesis_summary',
      'evidence_metrics',
      'reasoning_explanation',
      'beginner_lesson',
      'limitations',
      'next_check',
      'actual_outcome',
      'outcome_data',
      'result_label',
      'lesson_learned',
      'model_adjustment',
      'data_confidence',
      'uncertainty_level',
      'review_status',
    ],
    reportRuns: [
      'report_id',
      'issue_date',
      'week_start',
      'week_end',
      'generation_status',
      'generated_at',
      'approved_at',
      'sent_at',
      'recipient_group',
      'report_file_path',
      'email_subject',
      'notes',
    ],
    automationStageReviews: [
      'review_date',
      'current_stage',
      'quality_score',
      'hypothesis_structure_pass_rate',
      'beginner_explanation_quality',
      'data_confidence_summary',
      'source_stability',
      'user_revision_level',
      'recurring_manual_work',
      'ai_recommendation',
      'recommended_next_stage',
      'proposal_summary',
      'approval_status',
      'approved_by',
      'approved_at',
      'notes',
    ],
    changeApprovalLog: [
      'change_id',
      'proposed_at',
      'change_type',
      'proposal_title',
      'reason',
      'expected_benefit',
      'risk',
      'rollback_plan',
      'approval_status',
      'applied_at',
      'result_note',
    ],
    agentReviewLog: [
      'review_id',
      'issue_date',
      'agent_name',
      'agent_role',
      'review_target',
      'status',
      'finding_summary',
      'risk_level',
      'required_action',
      'blocking',
      'resolved',
      'resolved_at',
      'notes',
    ],
  },
  dropdowns: {
    grade: ['높음', '중간', '낮음'],
    reviewStatus: ['초안', '질문 중', '승인', '보류'],
    resultLabel: ['맞음', '부분적으로 맞음', '빗나감', '아직 모름'],
    hypothesisReviewStatus: ['복기 대기', '복기 완료', '추가 확인', '보류'],
    reportStatus: ['준비', '초안 생성', '사용자 확인 필요', '승인', '발송 완료', '발송 보류'],
    approvalStatus: ['proposed', 'approved', 'rejected', 'postponed', 'applied', 'rolled_back'],
    agentStatus: ['pass', 'warning', 'block', 'proposal'],
    riskLevel: ['low', 'medium', 'high'],
  },
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SSMK 자동화')
    .addItem('0. 주간 초안 준비 전체 실행', 'runWeeklyDraftPrepWorkflow')
    .addSeparator()
    .addItem('1. 시트 구조 점검/보정', 'setupSsmkWorkbook')
    .addItem('1-1. 추천화 표현 자동 순화', 'autoSoftenWeeklyScoreLanguage')
    .addItem('2. 주간 입력 데이터 묶기', 'collectWeeklyInputs')
    .addItem('3. AI 프롬프트 문서 만들기', 'createWeeklyPromptDoc')
    .addItem('4. 가설 복기 예약', 'scheduleHypothesisReviews')
    .addItem('5. 에이전트 리뷰 보드 실행', 'runAgentReviewBoard')
    .addItem('6. 자동화 준비도 기록', 'evaluateAutomationReadiness')
    .addToUi();
}

function runWeeklyDraftPrepWorkflow(issueDate) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();

  setupSsmkWorkbook();
  const languageResult = autoSoftenWeeklyScoreLanguage(targetIssueDate);
  const promptResult = createWeeklyPromptDoc_(targetIssueDate);
  const scheduledReviewCount = scheduleHypothesisReviews(targetIssueDate);
  const agentChecks = runAgentReviewBoard(targetIssueDate);
  const readiness = evaluateAutomationReadiness();
  const blockingChecks = agentChecks.filter((check) => check.blocking);
  const finalStatus = blockingChecks.length > 0 ? '사용자 확인 필요' : '초안 생성';
  const summary = [
    `원클릭 주간 초안 준비 실행일: ${nowText_()}`,
    `issue_date: ${targetIssueDate}`,
    `문장 자동 순화: ${languageResult.updatedCellCount}개 셀`,
    `AI 프롬프트 문서: ${promptResult.url}`,
    `새 가설 복기 예약: ${scheduledReviewCount}개`,
    `에이전트 차단 항목: ${blockingChecks.length}개`,
    `자동화 준비도 점수: ${readiness.quality_score}`,
    `다음 상태: ${finalStatus}`,
  ].join('\n');

  updateReportRunStatus_(promptResult.reportId, finalStatus, summary);
  Logger.log(summary);

  SpreadsheetApp.getUi().alert(
    [
      '주간 초안 준비 자동화가 끝났습니다.',
      '',
      `문장 자동 순화: ${languageResult.updatedCellCount}개 셀`,
      `새 가설 복기 예약: ${scheduledReviewCount}개`,
      `에이전트 차단 항목: ${blockingChecks.length}개`,
      '',
      blockingChecks.length > 0
        ? '차단 항목이 있으니 agent_review_log를 확인한 뒤 발행 전 문장을 더 점검하세요.'
        : '차단 항목은 없습니다. report_runs의 프롬프트 문서로 리포트 초안을 만들면 됩니다.',
    ].join('\n')
  );

  return {
    issue_date: targetIssueDate,
    softened_cells: languageResult.updatedCellCount,
    prompt_url: promptResult.url,
    scheduled_reviews: scheduledReviewCount,
    blocking_checks: blockingChecks.length,
    readiness: readiness,
  };
}

function setupSsmkWorkbook() {
  const ss = SpreadsheetApp.getActive();

  ensureSheet_(ss, SSMK.sheets.hypothesisReviews, SSMK.headers.hypothesisReviews.length);
  ensureSheet_(ss, SSMK.sheets.reportRuns, SSMK.headers.reportRuns.length);
  ensureSheet_(ss, SSMK.sheets.automationStageReviews, SSMK.headers.automationStageReviews.length);
  ensureSheet_(ss, SSMK.sheets.changeApprovalLog, SSMK.headers.changeApprovalLog.length);
  ensureSheet_(ss, SSMK.sheets.agentReviewLog, SSMK.headers.agentReviewLog.length);

  normalizeWatchlistColumns_(ss);
  setHeaders_(ss, SSMK.sheets.weeklyScores, SSMK.headers.weeklyScores);
  setHeaders_(ss, SSMK.sheets.scoreHistory, SSMK.headers.weeklyScores);
  setHeaders_(ss, SSMK.sheets.hypothesisReviews, SSMK.headers.hypothesisReviews);
  setHeaders_(ss, SSMK.sheets.reportRuns, SSMK.headers.reportRuns);
  setHeaders_(ss, SSMK.sheets.automationStageReviews, SSMK.headers.automationStageReviews);
  setHeaders_(ss, SSMK.sheets.changeApprovalLog, SSMK.headers.changeApprovalLog);
  setHeaders_(ss, SSMK.sheets.agentReviewLog, SSMK.headers.agentReviewLog);
  applyWeeklyScoreFormulas_(ss);
  applyDropdowns_(ss);

  SpreadsheetApp.getUi().alert('SSMK 시트 구조 점검이 끝났습니다. 기존 데이터는 지우지 않았습니다.');
}

function collectWeeklyInputs(issueDate) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  const weeklyScores = readObjects_(SSMK.sheets.weeklyScores)
    .filter((row) => sameDateText_(row.issue_date, targetIssueDate));
  const pendingReviews = readObjects_(SSMK.sheets.hypothesisReviews)
    .filter((row) => row.review_status === '복기 대기' || row.review_status === '추가 확인');

  const payload = {
    project_name: SSMK.projectName,
    purpose: SSMK.disclaimer,
    issue_date: targetIssueDate,
    weekly_scores: weeklyScores,
    industry_notes: readObjects_(SSMK.sheets.industryNotes),
    news_events: readObjects_(SSMK.sheets.newsEvents),
    data_sources: readObjects_(SSMK.sheets.dataSources),
    pending_hypothesis_reviews: pendingReviews,
    required_hypothesis_structure: [
      '가설 요약',
      '근거 지표/데이터',
      '이 지표/데이터를 보고 왜 그렇게 예상했나',
      '초보자가 배울 포인트',
      '한계와 다음 확인',
    ],
    review_board_agents: ['루미', '벡터', '세이지', '파일럿', '노바'],
  };

  Logger.log(JSON.stringify(payload, null, 2));
  return payload;
}

function buildWeeklyReportPrompt(issueDate) {
  const inputs = collectWeeklyInputs(issueDate);
  return [
    '너는 SSMK 투자 관찰노트의 AI 분석가이자 초보자용 투자 공부 선생님이다.',
    '',
    '목적:',
    '- 투자 추천이 아니라 투자 공부용 관찰 기록을 만든다.',
    '- 점수는 매수/매도 신호가 아니라 이번 주 공부 우선순위다.',
    '- 모든 가설은 근거와 해석 과정을 초보자도 이해할 수 있게 설명한다.',
    '',
    '반드시 지킬 원칙:',
    '1. 매수/매도 추천처럼 쓰지 않는다.',
    '2. 점수가 높다고 좋은 투자 대상이라고 말하지 않는다.',
    '3. 데이터 신뢰도가 낮으면 한계를 분명히 쓴다.',
    '4. 최신 실적 확인 전이면 확정 표현을 쓰지 않는다.',
    '5. 자동화 발전이나 중요한 변경은 제안서로만 만들고 사용자 승인 전에는 적용하지 않는다.',
    '',
    '필수 가설 구조:',
    '- 가설 요약',
    '- 근거 지표/데이터',
    '- 이 지표/데이터를 보고 왜 그렇게 예상했나',
    '- 초보자가 배울 포인트',
    '- 한계와 다음 확인',
    '',
    '에이전트 리뷰 보드:',
    '- 루미: 콘텐츠 초안 작성',
    '- 벡터: 데이터 검증',
    '- 세이지: 추천화 표현과 품질 검토',
    '- 파일럿: 승인/발송/복기 프로세스 확인',
    '- 노바: 자동화 발전 제안 여부 판단. 적용은 금지.',
    '',
    '출력 목차:',
    '1. 이번 주 3줄 요약',
    '2. 시장 온도계',
    '3. 이번 주 산업 관찰 우선순위 3개',
    '4. SSMK 관찰 우선순위 3개',
    '5. 점수 변화 확인 후보 3개',
    '6. 이번 주 AI 가설 3개',
    '7. AI의 솔직한 한계',
    '8. 밸류에이션 재점검 후보 3개',
    '9. 리스크 먼저 확인할 후보 3개',
    '10. 지난 가설과 실제 결과 비교',
    '11. 장기 추적 그래프 메모',
    '12. 종목 딥다이브 1개',
    '13. 이번 주 레슨&런',
    '14. 다음 주 체크 이벤트',
    '15. 데이터 출처',
    '16. AI 에이전트 리뷰 결과',
    '17. AI 품질 자가검증 메모',
    '18. 자동화 발전 제안',
    '19. 발행 전 검토 체크리스트',
    '20. 면책 문구',
    '',
    '입력 데이터(JSON):',
    JSON.stringify(inputs, null, 2),
  ].join('\n');
}

function createWeeklyPromptDoc(issueDate) {
  return createWeeklyPromptDoc_(issueDate).url;
}

function createWeeklyPromptDoc_(issueDate) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  const prompt = buildWeeklyReportPrompt(targetIssueDate);
  const doc = DocumentApp.create(`SSMK weekly report prompt - ${targetIssueDate}`);
  doc.getBody().setText(prompt);
  doc.saveAndClose();

  const reportId = createReportRunRow_(targetIssueDate, '', '', '초안 생성', doc.getUrl(), 'AI 프롬프트 문서 생성');
  Logger.log(`Created prompt doc: ${doc.getUrl()}`);
  Logger.log(`Created report run: ${reportId}`);
  return {
    url: doc.getUrl(),
    reportId: reportId,
  };
}

function autoSoftenWeeklyScoreLanguage(issueDate) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  const sheet = SpreadsheetApp.getActive().getSheetByName(SSMK.sheets.weeklyScores);
  if (!sheet || sheet.getLastRow() < 2) {
    return { issue_date: targetIssueDate, updatedCellCount: 0 };
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const issueDateColumn = headers.indexOf('issue_date') + 1;
  const targetColumns = [
    'hypothesis_summary',
    'reasoning_explanation',
    'beginner_lesson',
    'limitations',
    'next_check',
  ].map((header) => headers.indexOf(header) + 1).filter((column) => column > 0);

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  let updatedCellCount = 0;

  values.forEach((row, rowIndex) => {
    if (!sameDateText_(row[issueDateColumn - 1], targetIssueDate)) return;

    targetColumns.forEach((columnNumber) => {
      const original = row[columnNumber - 1];
      if (typeof original !== 'string' || original === '') return;

      const softened = softenLearningLanguage_(original);
      if (softened !== original) {
        sheet.getRange(rowIndex + 2, columnNumber).setValue(softened);
        updatedCellCount += 1;
      }
    });
  });

  Logger.log(`Softened learning language cells: ${updatedCellCount}`);
  return {
    issue_date: targetIssueDate,
    updatedCellCount: updatedCellCount,
  };
}

function scheduleHypothesisReviews(issueDate) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  const rows = readObjects_(SSMK.sheets.weeklyScores)
    .filter((row) => sameDateText_(row.issue_date, targetIssueDate))
    .filter((row) => row.hypothesis_summary);

  if (rows.length === 0) {
    throw new Error('복기 예약할 hypothesis_summary가 없습니다. weekly_scores에 가설을 먼저 입력하세요.');
  }

  const existingIds = new Set(readObjects_(SSMK.sheets.hypothesisReviews).map((row) => row.hypothesis_id));
  let createdCount = 0;

  rows.forEach((row, index) => {
    [
      { window: '1w', days: 7 },
      { window: '4w', days: 28 },
    ].forEach((review) => {
      const hypothesisId = `HYP-${compactDate_(targetIssueDate)}-${pad3_(index + 1)}-${review.window.toUpperCase()}`;
      if (existingIds.has(hypothesisId)) return;

      appendObject_(SSMK.sheets.hypothesisReviews, SSMK.headers.hypothesisReviews, {
        hypothesis_id: hypothesisId,
        issue_date: targetIssueDate,
        review_date: addDaysText_(targetIssueDate, review.days),
        review_window: review.window,
        ticker: row.ticker,
        company: row.company,
        core_industry: row.core_industry,
        hypothesis_summary: row.hypothesis_summary,
        evidence_metrics: row.evidence_metrics,
        reasoning_explanation: row.reasoning_explanation,
        beginner_lesson: row.beginner_lesson,
        limitations: row.limitations,
        next_check: row.next_check,
        result_label: '아직 모름',
        data_confidence: row.data_confidence || '중간',
        uncertainty_level: row.uncertainty_level || '중간',
        review_status: '복기 대기',
      });
      createdCount += 1;
    });
  });

  Logger.log(`Scheduled hypothesis review rows: ${createdCount}`);
  return createdCount;
}

function runAgentReviewBoard(issueDate) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  const weeklyRows = readObjects_(SSMK.sheets.weeklyScores)
    .filter((row) => sameDateText_(row.issue_date, targetIssueDate));
  const reportTarget = `weekly-report-${targetIssueDate}`;
  const checks = buildAgentChecks_(targetIssueDate, weeklyRows);

  checks.forEach((check, index) => {
    appendObject_(SSMK.sheets.agentReviewLog, SSMK.headers.agentReviewLog, {
      review_id: `AR-${compactDate_(targetIssueDate)}-${compactTime_()}-${pad3_(index + 1)}`,
      issue_date: targetIssueDate,
      agent_name: check.agentName,
      agent_role: check.agentRole,
      review_target: reportTarget,
      status: check.status,
      finding_summary: check.summary,
      risk_level: check.riskLevel,
      required_action: check.requiredAction,
      blocking: check.blocking,
      resolved: false,
      notes: check.notes,
    });
  });

  Logger.log(JSON.stringify(checks, null, 2));
  return checks;
}

function evaluateAutomationReadiness() {
  const today = today_();
  const weeklyRows = readObjects_(SSMK.sheets.weeklyScores).filter((row) => row.hypothesis_summary);
  const reviewRows = readObjects_(SSMK.sheets.agentReviewLog);
  const totalHypotheses = weeklyRows.length;
  const completeHypotheses = weeklyRows.filter(hasCompleteHypothesis_).length;
  const passRate = totalHypotheses === 0 ? 0 : Math.round((completeHypotheses / totalHypotheses) * 100);
  const blockingCount = reviewRows.filter((row) => String(row.blocking).toUpperCase() === 'TRUE').length;
  const qualityScore = Math.max(0, Math.min(100, passRate - blockingCount * 10));
  const canPropose = totalHypotheses >= 6 && passRate >= 90 && blockingCount === 0;

  appendObject_(SSMK.sheets.automationStageReviews, SSMK.headers.automationStageReviews, {
    review_date: today,
    current_stage: 'AI 자동 초안 + 사람 학습 승인',
    quality_score: qualityScore,
    hypothesis_structure_pass_rate: `${passRate}%`,
    beginner_explanation_quality: passRate >= 90 ? '좋음' : '보완 필요',
    data_confidence_summary: summarizeConfidence_(weeklyRows),
    source_stability: '운영 2~4회 누적 후 재평가',
    user_revision_level: '미기록',
    recurring_manual_work: '미기록',
    ai_recommendation: canPropose ? '발전 제안 검토 가능' : '아직 발전 제안 보류',
    recommended_next_stage: canPropose ? 'AI 리포트 초안 자동화 강화' : '없음',
    proposal_summary: canPropose
      ? '가설 구조와 리뷰 로그가 안정적이면 사용자 승인 요청 제안서를 작성합니다.'
      : '운영 기록이 아직 부족하거나 차단 항목이 있어 현 단계 유지가 적절합니다.',
    approval_status: 'postponed',
    notes: '이 함수는 판단 근거만 기록합니다. 승인 없이 자동화 수준을 바꾸지 않습니다.',
  });

  return {
    quality_score: qualityScore,
    hypothesis_structure_pass_rate: passRate,
    blocking_count: blockingCount,
    can_propose_next_stage: canPropose,
  };
}

function createAutomationStageProposal(title, reason, expectedBenefit, risk, rollbackPlan) {
  if (!title || !reason || !expectedBenefit || !risk || !rollbackPlan) {
    throw new Error('제안서에는 제목, 이유, 기대 효과, 위험, 되돌리는 방법이 모두 필요합니다.');
  }

  const changeId = `CHG-${compactDate_(today_())}-${String(new Date().getTime()).slice(-5)}`;
  appendObject_(SSMK.sheets.changeApprovalLog, SSMK.headers.changeApprovalLog, {
    change_id: changeId,
    proposed_at: today_(),
    change_type: 'automation_stage',
    proposal_title: title,
    reason: reason,
    expected_benefit: expectedBenefit,
    risk: risk,
    rollback_plan: rollbackPlan,
    approval_status: 'proposed',
    result_note: '사용자 승인 전에는 적용하지 않음',
  });
  return changeId;
}

function sendApprovedReport(reportId) {
  const report = findReportRun_(reportId);
  if (!report) throw new Error(`report_id를 찾을 수 없습니다: ${reportId}`);
  if (report.generation_status !== '승인') {
    throw new Error('발송 차단: report_runs.generation_status가 승인일 때만 발송할 수 있습니다.');
  }

  throw new Error('이메일 발송은 아직 초안 단계에서 비활성화되어 있습니다. 본문/PDF 검증 후 별도 승인으로 구현하세요.');
}

function applyApprovedChange(changeId) {
  const change = findChange_(changeId);
  if (!change) throw new Error(`change_id를 찾을 수 없습니다: ${changeId}`);
  if (change.approval_status !== 'approved') {
    throw new Error('변경 적용 차단: approval_status가 approved일 때만 적용할 수 있습니다.');
  }

  throw new Error('중요 변경 자동 적용은 아직 비활성화되어 있습니다. 승인 후에도 수동 확인 절차를 먼저 거치세요.');
}

function buildAgentChecks_(issueDate, weeklyRows) {
  const requiredCount = 3;
  const completeRows = weeklyRows.filter(hasCompleteHypothesis_);
  const lowConfidenceRows = weeklyRows.filter((row) => row.data_confidence === '낮음');
  const recommendationRiskRows = weeklyRows.filter((row) => {
    const text = [
      row.hypothesis_summary,
      row.reasoning_explanation,
      row.beginner_lesson,
      row.limitations,
    ].join(' ');
    return hasRecommendationLikeLanguage_(text);
  });

  return [
    {
      agentName: '루미',
      agentRole: '콘텐츠 크리에이터',
      status: completeRows.length >= requiredCount ? 'pass' : 'warning',
      riskLevel: completeRows.length >= requiredCount ? 'low' : 'medium',
      blocking: false,
      summary: `완성된 AI 가설 ${completeRows.length}개 확인`,
      requiredAction: completeRows.length >= requiredCount ? '문장 가독성 확인' : 'AI 가설 3개 이상을 5단 구조로 보완',
      notes: '루미는 초안을 만들지만 최종 승인하지 않습니다.',
    },
    {
      agentName: '벡터',
      agentRole: '데이터 검증',
      status: lowConfidenceRows.length > 0 ? 'warning' : 'pass',
      riskLevel: lowConfidenceRows.length > 0 ? 'medium' : 'low',
      blocking: false,
      summary: `데이터 신뢰도 낮음 항목 ${lowConfidenceRows.length}개`,
      requiredAction: lowConfidenceRows.length > 0 ? '낮음 항목은 공식 출처와 한계 표시 확인' : '출처 링크 유지',
      notes: '벡터는 최신성, 출처, 데이터 기준을 봅니다.',
    },
    {
      agentName: '세이지',
      agentRole: '편집자/품질 검증',
      status: recommendationRiskRows.length > 0 ? 'block' : 'pass',
      riskLevel: recommendationRiskRows.length > 0 ? 'high' : 'low',
      blocking: recommendationRiskRows.length > 0,
      summary: `추천처럼 읽힐 수 있는 표현 후보 ${recommendationRiskRows.length}개`,
      requiredAction: recommendationRiskRows.length > 0 ? '매수/추천/확실 표현 제거 후 재검토' : '면책 문구와 관찰 표현 유지',
      notes: '세이지는 문장이 멋진지보다 안전한지를 봅니다.',
    },
    {
      agentName: '파일럿',
      agentRole: '운영/프로세스 감독',
      status: weeklyRows.length > 0 ? 'pass' : 'warning',
      riskLevel: weeklyRows.length > 0 ? 'low' : 'medium',
      blocking: false,
      summary: `issue_date ${issueDate} 기준 weekly_scores 행 ${weeklyRows.length}개`,
      requiredAction: weeklyRows.length > 0 ? '가설 복기 예약 확인' : 'weekly_scores 입력 후 다시 실행',
      notes: '파일럿은 승인, 발송, 복기 흐름이 끊기지 않는지 봅니다.',
    },
    {
      agentName: '노바',
      agentRole: '자동화 발전 제안',
      status: 'pass',
      riskLevel: 'low',
      blocking: false,
      summary: '이번 함수는 발전 제안을 적용하지 않고 필요성만 관찰',
      requiredAction: '2~4회 운영 기록이 쌓이면 evaluateAutomationReadiness 실행',
      notes: '노바는 제안만 하며 사용자 승인 전에는 변경하지 않습니다.',
    },
  ];
}

function softenLearningLanguage_(text) {
  return String(text)
    .replace(/높은 관찰 등급을 유지할 수 있다/g, '관찰 등급이 왜 높게 나왔는지 확인할 필요가 있다')
    .replace(/높은 관찰 등급을 유지할 수 있습니다/g, '관찰 등급이 왜 높게 나왔는지 확인할 필요가 있습니다')
    .replace(/성장 기대는 강하지만/g, '성장 기대가 실제 데이터로 확인되는지 봐야 하지만')
    .replace(/점수 회복 가능성이 있다/g, '점수 변화의 원인을 관찰할 필요가 있다')
    .replace(/점수 회복 가능성이 있습니다/g, '점수 변화의 원인을 관찰할 필요가 있습니다')
    .replace(/좋아 보인다/g, '확인해 볼 부분이 있다')
    .replace(/좋아 보입니다/g, '확인해 볼 부분이 있습니다')
    .replace(/긍정적입니다/g, '추가로 관찰할 만합니다')
    .replace(/긍정적이다/g, '추가로 관찰할 만하다')
    .replace(/기회가 될 수 있다/g, '관찰 질문이 될 수 있다')
    .replace(/기회가 될 수 있습니다/g, '관찰 질문이 될 수 있습니다')
    .replace(/매력 증가/g, '관찰 필요성 증가')
    .replace(/매력적/g, '관찰할 만한');
}

function hasRecommendationLikeLanguage_(text) {
  return /(매수|매도|추천|확실한?\s*기회|수익\s*(기회|보장|확정|가능)|지금\s*사|사야\s*할|투자\s*기회)/.test(text);
}

function hasCompleteHypothesis_(row) {
  return Boolean(
    row.hypothesis_summary &&
      row.evidence_metrics &&
      row.reasoning_explanation &&
      row.beginner_lesson &&
      row.limitations &&
      row.next_check
  );
}

function normalizeWatchlistColumns_(ss) {
  const sheet = ss.getSheetByName(SSMK.sheets.watchlist);
  if (!sheet) return;

  const header = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
  const hasThemeTags = header.indexOf('theme_tags') !== -1;
  const hasInvestmentStyle = header.indexOf('investment_style') !== -1;

  if (!hasThemeTags || !hasInvestmentStyle) {
    sheet.insertColumnsAfter(3, 2);
  }

  setHeaders_(ss, SSMK.sheets.watchlist, SSMK.headers.watchlist);
}

function applyWeeklyScoreFormulas_(ss) {
  const sheet = ss.getSheetByName(SSMK.sheets.weeklyScores);
  if (!sheet) return;

  sheet.getRange('N2').setFormula('=ARRAYFORMULA(IF(C2:C="","",ROUND(H2:H*0.30 + I2:I*0.20 + J2:J*0.20 + K2:K*0.15 + L2:L*0.10 + M2:M*0.05, 2)))');
  sheet.getRange('O2').setFormula('=ARRAYFORMULA(IF(N2:N="","",IF(N2:N>=8,"높음",IF(N2:N>=6,"중간","낮음"))))');
  sheet.getRange('Q2').setFormula('=ARRAYFORMULA(IF(C2:C="","",IFERROR(N2:N-P2:P,"")))');
}

function applyDropdowns_(ss) {
  setDropdown_(ss, SSMK.sheets.watchlist, 7, SSMK.dropdowns.riskLevel.map(capitalize_));
  setDropdown_(ss, SSMK.sheets.watchlist, 12, ['TRUE', 'FALSE']);

  setDropdown_(ss, SSMK.sheets.weeklyScores, 15, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.weeklyScores, 18, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.weeklyScores, 19, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.weeklyScores, 28, SSMK.dropdowns.reviewStatus);

  setDropdown_(ss, SSMK.sheets.hypothesisReviews, 16, SSMK.dropdowns.resultLabel);
  setDropdown_(ss, SSMK.sheets.hypothesisReviews, 19, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.hypothesisReviews, 20, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.hypothesisReviews, 21, SSMK.dropdowns.hypothesisReviewStatus);

  setDropdown_(ss, SSMK.sheets.reportRuns, 5, SSMK.dropdowns.reportStatus);
  setDropdown_(ss, SSMK.sheets.automationStageReviews, 13, SSMK.dropdowns.approvalStatus);
  setDropdown_(ss, SSMK.sheets.changeApprovalLog, 9, SSMK.dropdowns.approvalStatus);
  setDropdown_(ss, SSMK.sheets.agentReviewLog, 6, SSMK.dropdowns.agentStatus);
  setDropdown_(ss, SSMK.sheets.agentReviewLog, 8, SSMK.dropdowns.riskLevel);
  setDropdown_(ss, SSMK.sheets.agentReviewLog, 10, ['TRUE', 'FALSE']);
  setDropdown_(ss, SSMK.sheets.agentReviewLog, 11, ['TRUE', 'FALSE']);
}

function ensureSheet_(ss, sheetName, minColumns) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  if (sheet.getMaxColumns() < minColumns) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), minColumns - sheet.getMaxColumns());
  }
  sheet.setFrozenRows(1);
  return sheet;
}

function setHeaders_(ss, sheetName, headers) {
  const sheet = ensureSheet_(ss, sheetName, headers.length);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setFontColor('#ffffff')
    .setBackground('#1e446b');
  sheet.autoResizeColumns(1, headers.length);
}

function setDropdown_(ss, sheetName, columnNumber, values) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  const maxRows = Math.max(sheet.getMaxRows() - 1, 1);
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, columnNumber, maxRows, 1).setDataValidation(rule);
}

function readObjects_(sheetName) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (lastRow < 2 || lastColumn < 1) return [];

  const values = sheet.getRange(1, 1, lastRow, lastColumn).getDisplayValues();
  const headers = values[0].filter((header) => header);
  return values.slice(1)
    .filter((row) => row.some((cell) => cell !== ''))
    .map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || '';
      });
      return item;
    });
}

function appendObject_(sheetName, headers, object) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet) throw new Error(`시트를 찾을 수 없습니다: ${sheetName}`);
  const row = headers.map((header) => Object.prototype.hasOwnProperty.call(object, header) ? object[header] : '');
  sheet.appendRow(row);
}

function createReportRunRow_(issueDate, weekStart, weekEnd, status, filePath, notes) {
  const reportId = `RPT-${compactDate_(issueDate)}-${String(new Date().getTime()).slice(-5)}`;
  appendObject_(SSMK.sheets.reportRuns, SSMK.headers.reportRuns, {
    report_id: reportId,
    issue_date: issueDate,
    week_start: weekStart,
    week_end: weekEnd,
    generation_status: status,
    generated_at: nowText_(),
    recipient_group: 'active recipients',
    report_file_path: filePath,
    email_subject: `[SSMK] Weekly Insight ${issueDate}`,
    notes: notes,
  });
  return reportId;
}

function updateReportRunStatus_(reportId, status, notes) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SSMK.sheets.reportRuns);
  if (!sheet || sheet.getLastRow() < 2) return false;

  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
  const headers = values[0];
  const reportIdColumn = headers.indexOf('report_id') + 1;
  const statusColumn = headers.indexOf('generation_status') + 1;
  const notesColumn = headers.indexOf('notes') + 1;
  if (reportIdColumn < 1 || statusColumn < 1 || notesColumn < 1) return false;

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    if (values[rowIndex][reportIdColumn - 1] === reportId) {
      sheet.getRange(rowIndex + 1, statusColumn).setValue(status);
      sheet.getRange(rowIndex + 1, notesColumn).setValue(notes);
      return true;
    }
  }

  return false;
}

function findReportRun_(reportId) {
  return readObjects_(SSMK.sheets.reportRuns).find((row) => row.report_id === reportId);
}

function findChange_(changeId) {
  return readObjects_(SSMK.sheets.changeApprovalLog).find((row) => row.change_id === changeId);
}

function getLatestIssueDate_() {
  const rows = readObjects_(SSMK.sheets.weeklyScores).filter((row) => row.issue_date);
  if (rows.length === 0) return '';
  return rows.map((row) => row.issue_date).sort().pop();
}

function summarizeConfidence_(rows) {
  if (rows.length === 0) return '데이터 없음';
  const counts = rows.reduce((acc, row) => {
    const key = row.data_confidence || '미입력';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(counts).map((key) => `${key}:${counts[key]}`).join(', ');
}

function sameDateText_(value, target) {
  return String(value || '').slice(0, 10) === String(target || '').slice(0, 10);
}

function today_() {
  return Utilities.formatDate(new Date(), SSMK.timezone, 'yyyy-MM-dd');
}

function nowText_() {
  return Utilities.formatDate(new Date(), SSMK.timezone, 'yyyy-MM-dd HH:mm:ss');
}

function compactDate_(dateText) {
  return String(dateText || today_()).replace(/-/g, '');
}

function compactTime_() {
  return Utilities.formatDate(new Date(), SSMK.timezone, 'HHmmss');
}

function addDaysText_(dateText, days) {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() + days);
  return Utilities.formatDate(date, SSMK.timezone, 'yyyy-MM-dd');
}

function pad3_(number) {
  return String(number).padStart(3, '0');
}

function capitalize_(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

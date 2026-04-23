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
    userPreferences: 'user_preferences',
    sourcePolicy: 'source_policy',
    automationSchedules: 'automation_schedules',
    watchlist: 'watchlist',
    weeklyScores: 'weekly_scores',
    scoreHistory: 'score_history',
    industryNotes: 'industry_notes',
    reportQueue: 'report_queue',
    recipients: 'recipients',
    newsEvents: 'news_events',
    dataSources: 'data_sources',
    marketData: 'market_data',
    companyFundamentals: 'company_fundamentals',
    revenueBreakdown: 'revenue_breakdown',
    shareholderReturns: 'shareholder_returns',
    insiderActivity: 'insider_activity',
    etfWatch: 'etf_watch',
    sectorThemeScores: 'sector_theme_scores',
    hypothesisLab: 'hypothesis_lab',
    hypothesisReviews: 'hypothesis_reviews',
    hypothesisEvolutionLog: 'hypothesis_evolution_log',
    visualizationQueue: 'visualization_queue',
    reportRuns: 'report_runs',
    reportSections: 'report_sections',
    reportVersions: 'report_versions',
    revisionRequests: 'revision_requests',
    automationStageReviews: 'automation_stage_reviews',
    changeApprovalLog: 'change_approval_log',
    agentReviewLog: 'agent_review_log',
    automationRunLog: 'automation_run_log',
    automationStepLog: 'automation_step_log',
    bottleneckLog: 'bottleneck_log',
    errorLog: 'error_log',
    qaReviewLog: 'qa_review_log',
    glossary: 'glossary',
  },
  headers: {
    sourcePolicy: [
      'source_key',
      'source_name',
      'source_type',
      'source_url',
      'trust_level',
      'update_frequency',
      'fallback_source',
      'usage_notes',
      'active',
    ],
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
    marketData: [
      'market_date',
      'symbol',
      'name',
      'asset_type',
      'close_price',
      'change_pct_1w',
      'change_pct_4w',
      'volume',
      'data_confidence',
      'source_name',
      'source_url',
      'updated_at',
      'notes',
    ],
    companyFundamentals: [
      'ticker',
      'company',
      'fiscal_period',
      'revenue',
      'revenue_growth_yoy',
      'gross_margin',
      'operating_margin',
      'net_margin',
      'eps',
      'free_cash_flow',
      'debt_to_equity',
      'data_confidence',
      'source_name',
      'source_url',
      'updated_at',
      'notes',
    ],
    revenueBreakdown: [
      'ticker',
      'company',
      'fiscal_period',
      'segment_name',
      'revenue_amount',
      'revenue_pct',
      'growth_yoy',
      'source_name',
      'source_url',
      'notes',
    ],
    shareholderReturns: [
      'ticker',
      'company',
      'fiscal_period',
      'dividend_yield',
      'payout_ratio',
      'dividend_growth_5y',
      'buyback_amount',
      'buyback_yield',
      'free_cash_flow_coverage',
      'source_name',
      'source_url',
      'notes',
    ],
    insiderActivity: [
      'ticker',
      'company',
      'transaction_date',
      'insider_name',
      'role',
      'transaction_type',
      'shares',
      'value_usd',
      'plan_type',
      'source_name',
      'source_url',
      'notes',
    ],
    etfWatch: [
      'etf_ticker',
      'etf_name',
      'category',
      'expense_ratio',
      'dividend_yield',
      'top_holdings',
      'top_10_weight',
      'related_theme',
      'source_name',
      'source_url',
      'updated_at',
      'notes',
    ],
    sectorThemeScores: [
      'issue_date',
      'sector_or_theme',
      'category',
      'average_ssmk_score',
      'score_change_4w',
      'leading_tickers',
      'lagging_tickers',
      'data_confidence',
      'interpretation',
      'notes',
    ],
    hypothesisLab: [
      'hypothesis_id',
      'hypothesis_version',
      'issue_date',
      'hypothesis_type',
      'related_tickers',
      'related_industry',
      'one_line_forecast',
      'evidence_metrics',
      'source_summary',
      'interpretation',
      'red_team_challenge',
      'revised_hypothesis',
      'forecast_condition',
      'review_condition',
      'beginner_lesson',
      'glossary_terms',
      'confidence_level',
      'status',
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
    hypothesisEvolutionLog: [
      'hypothesis_id',
      'hypothesis_version',
      'issue_date',
      'changed_at',
      'previous_hypothesis',
      'new_hypothesis',
      'change_reason',
      'added_conditions',
      'removed_conditions',
      'next_check',
      'source_request_id',
      'notes',
    ],
    visualizationQueue: [
      'chart_id',
      'issue_date',
      'report_id',
      'section_key',
      'chart_type',
      'data_range_or_source',
      'title',
      'description',
      'status',
      'owner_agent',
      'output_url',
      'notes',
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
    reportSections: [
      'report_id',
      'section_key',
      'section_title',
      'section_order',
      'status',
      'content_summary',
      'current_version',
      'last_updated_at',
      'notes',
    ],
    reportVersions: [
      'report_id',
      'version_label',
      'created_at',
      'source_request_id',
      'output_url',
      'changed_sections',
      'change_summary',
      'created_by',
      'notes',
    ],
    revisionRequests: [
      'request_id',
      'report_id',
      'target_scope',
      'target_section',
      'request_type',
      'user_instruction',
      'status',
      'created_at',
      'processed_at',
      'result_version',
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
      'run_id',
      'report_id',
    ],
    automationRunLog: [
      'run_id',
      'run_type',
      'started_at',
      'ended_at',
      'status',
      'trigger_source',
      'schedule_key',
      'report_id',
      'total_duration_sec',
      'final_output_url',
      'error_summary',
      'notes',
    ],
    automationStepLog: [
      'run_id',
      'step_order',
      'step_name',
      'agent_name',
      'started_at',
      'ended_at',
      'duration_sec',
      'status',
      'input_summary',
      'output_summary',
      'error_message',
      'retry_count',
    ],
    bottleneckLog: [
      'detected_at',
      'run_id',
      'bottleneck_type',
      'location',
      'symptom',
      'impact',
      'suggested_fix',
      'priority',
      'status',
    ],
    errorLog: [
      'error_id',
      'occurred_at',
      'run_id',
      'step_name',
      'severity',
      'error_type',
      'error_message',
      'root_cause_guess',
      'recovery_action',
      'resolved',
      'resolved_at',
    ],
    qaReviewLog: [
      'qa_id',
      'run_id',
      'review_date',
      'overall_status',
      'content_quality_score',
      'data_quality_score',
      'visualization_quality_score',
      'process_efficiency_score',
      'main_issues',
      'recommended_next_action',
      'automation_change_needed',
    ],
    glossary: [
      'term',
      'plain_language_definition',
      'example',
      'related_section',
      'source_name',
      'updated_at',
      'notes',
    ],
  },
  dropdowns: {
    grade: ['높음', '중간', '낮음'],
    reviewStatus: ['초안', '질문 중', '승인', '보류'],
    resultLabel: ['맞음', '부분적으로 맞음', '빗나감', '아직 모름'],
    hypothesisReviewStatus: ['복기 대기', '복기 완료', '추가 확인', '보류'],
    reportStatus: ['준비', '초안 생성', '사용자 확인 필요', '승인', '발송 완료', '발송 보류'],
    requestStatus: ['requested', 'in_progress', 'completed', 'blocked', 'cancelled'],
    requestScope: ['section', 'full_report'],
    requestType: [
      'make_easier',
      'add_more_data',
      'add_visuals',
      'make_more_human',
      'strengthen_forecast',
      'soften_recommendation_risk',
      'fix_source',
      'rewrite_with_red_team',
    ],
    workflowStatus: ['queued', 'running', 'success', 'warning', 'failed', 'blocked', 'skipped'],
    sectionStatus: ['draft', 'needs_revision', 'approved', 'archived'],
    hypothesisStatus: ['draft', 'active', 'review_scheduled', 'closed'],
    approvalStatus: ['proposed', 'approved', 'rejected', 'postponed', 'applied', 'rolled_back'],
    agentStatus: ['pass', 'warning', 'block', 'proposal'],
    riskLevel: ['low', 'medium', 'high'],
    yesNo: ['TRUE', 'FALSE'],
  },
};

const WORKBOOK_SCHEMA_SHEET_KEYS = [
  'sourcePolicy',
  'marketData',
  'companyFundamentals',
  'revenueBreakdown',
  'shareholderReturns',
  'insiderActivity',
  'etfWatch',
  'sectorThemeScores',
  'hypothesisLab',
  'hypothesisReviews',
  'hypothesisEvolutionLog',
  'visualizationQueue',
  'reportRuns',
  'reportSections',
  'reportVersions',
  'revisionRequests',
  'automationStageReviews',
  'changeApprovalLog',
  'agentReviewLog',
  'automationRunLog',
  'automationStepLog',
  'bottleneckLog',
  'errorLog',
  'qaReviewLog',
  'glossary',
];

const CONTROL_CENTER_DEFAULT_PREFERENCES = [
  {
    setting_key: 'report_depth',
    setting_value: 'dashboard_plus_explainer',
    setting_type: 'select',
    description: '리포트 깊이: 대시보드 중심인지, 설명을 더 붙일지 정합니다.',
    allowed_values: 'dashboard_only,dashboard_plus_explainer,deep_research',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'core_hypothesis_count',
    setting_value: '5',
    setting_type: 'number',
    description: '핵심 가설 개수: 한 주에 깊게 추적할 핵심 질문의 개수입니다. 처음에는 5개를 권장합니다.',
    allowed_values: '3,5,7',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'review_loop_limit',
    setting_value: '3',
    setting_type: 'number',
    description: '리뷰 반복 제한: 같은 섹션을 AI가 몇 번까지 다시 다듬을지 정합니다.',
    allowed_values: '1,2,3',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'final_output_type',
    setting_value: 'google_docs_draft',
    setting_type: 'select',
    description: '최종 결과물: 초안 저장 방식을 고릅니다.',
    allowed_values: 'google_docs_draft,markdown',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'email_auto_send',
    setting_value: 'OFF',
    setting_type: 'switch',
    description: '이메일 자동 발송: 사람 승인 없이 보내지 않도록 기본값은 OFF입니다.',
    allowed_values: 'ON,OFF',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'require_user_approval_for_major_change',
    setting_value: 'ON',
    setting_type: 'switch',
    description: '중요 변경 사용자 승인 필요: 자동화의 큰 변경은 사람 확인을 거치도록 잠금 상태로 둡니다.',
    allowed_values: 'ON,OFF',
    user_editable: 'FALSE',
  },
  {
    setting_key: 'include_market_overview',
    setting_value: 'ON',
    setting_type: 'switch',
    description: '포함 섹션: 시장 온도계와 이번 주 분위기를 넣을지 정합니다.',
    allowed_values: 'ON,OFF',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'include_hypothesis_lab',
    setting_value: 'ON',
    setting_type: 'switch',
    description: '포함 섹션: 핵심 가설과 근거 지표를 넣을지 정합니다.',
    allowed_values: 'ON,OFF',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'include_risk_summary',
    setting_value: 'ON',
    setting_type: 'switch',
    description: '포함 섹션: 리스크와 한계를 먼저 보여줄지 정합니다.',
    allowed_values: 'ON,OFF',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'include_beginner_lesson',
    setting_value: 'ON',
    setting_type: 'switch',
    description: '포함 섹션: 초보자 레슨과 용어 설명을 넣을지 정합니다.',
    allowed_values: 'ON,OFF',
    user_editable: 'TRUE',
  },
];

const CONTROL_CENTER_DEFAULT_SCHEDULES = [
  {
    schedule_key: 'monday_data_check',
    description: '월요일 데이터 상태 점검',
    enabled: 'OFF',
    cadence: 'weekly_monday_night',
    last_run_at: '',
    next_run_hint: '월요일 밤',
  },
  {
    schedule_key: 'tuesday_weekly_report',
    description: '화요일 Weekly Lab 자동 생성',
    enabled: 'ON',
    cadence: 'weekly_tuesday_morning',
    last_run_at: '',
    next_run_hint: '화요일 오전',
  },
  {
    schedule_key: 'wednesday_revision_review',
    description: '수요일 재작업 요청 반영',
    enabled: 'OFF',
    cadence: 'weekly_wednesday_morning',
    last_run_at: '',
    next_run_hint: '수요일 오전',
  },
  {
    schedule_key: 'monthly_hypothesis_review',
    description: '월말 가설 복기',
    enabled: 'OFF',
    cadence: 'monthly_end',
    last_run_at: '',
    next_run_hint: '월말',
  },
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SSMK 자동화')
    .addItem('설정 열기: SSMK Control Center', 'showSettingsSidebar')
    .addSeparator()
    .addItem('0. Weekly Lab 초안 준비 전체 실행', 'runWeeklyLabWorkflow')
    .addItem('0-legacy. 이전 주간 초안 준비 실행', 'runWeeklyDraftPrepWorkflow')
    .addSeparator()
    .addItem('1. 시트 구조 점검/보정', 'setupSsmkWorkbook')
    .addItem('1-1. 추천화 표현 자동 순화', 'autoSoftenWeeklyScoreLanguage')
    .addItem('2. 주간 입력 데이터 묶기', 'collectWeeklyInputs')
    .addItem('3-legacy. 이전 AI 프롬프트 문서 만들기', 'createWeeklyPromptDoc')
    .addItem('4. 가설 복기 예약', 'scheduleHypothesisReviews')
    .addItem('5. 에이전트 리뷰 보드 실행', 'runAgentReviewBoard')
    .addItem('6. 자동화 준비도 기록', 'evaluateAutomationReadiness')
    .addToUi();
}

function showSettingsSidebar() {
  const html = HtmlService
    .createHtmlOutputFromFile('SettingsSidebar')
    .setTitle('SSMK Control Center');
  SpreadsheetApp.getUi().showSidebar(html);
}

function runWeeklyLabWorkflow(issueDate) {
  const runId = startAutomationRun_('weekly_lab', 'tuesday_weekly_report', 'manual_or_schedule');
  let promptResult = null;
  let reportStatus = '사용자 확인 필요';
  let qaReview = null;

  try {
    const targetIssueDate = issueDate || getLatestIssueDate_() || today_();

    prepareSsmkWorkbook_();
    logAutomationStep_(runId, 1, 'prepare_workbook', '오퍼레이터', 'success', '시트 구조 점검', '탭/헤더/드롭다운 점검 완료', '', 0);

    const languageResult = autoSoftenWeeklyScoreLanguage(targetIssueDate);
    logAutomationStep_(
      runId,
      2,
      'soften_learning_language',
      '세이지',
      'success',
      `issue_date: ${targetIssueDate}`,
      `updated_cell_count: ${languageResult.updatedCellCount}`,
      '',
      0
    );

    promptResult = createWeeklyLabPromptDoc_(targetIssueDate, runId);
    logAutomationStep_(
      runId,
      3,
      'create_weekly_lab_prompt_doc',
      '오퍼레이터',
      'success',
      `issue_date: ${targetIssueDate}`,
      promptResult.url,
      '',
      0
    );

    const scheduledReviewCount = scheduleHypothesisReviews(targetIssueDate);
    logAutomationStep_(
      runId,
      4,
      'schedule_hypothesis_reviews',
      '파일럿',
      'success',
      `issue_date: ${targetIssueDate}`,
      `scheduled_reviews: ${scheduledReviewCount}`,
      '',
      0
    );

    const checks = runAgentReviewBoard(targetIssueDate, runId, promptResult.reportId);
    const blockingCount = checks.filter((check) => check.blocking).length;
    const workflowStatus = blockingCount > 0 ? '사용자 확인 필요' : '초안 생성 준비 완료';
    reportStatus = blockingCount > 0 ? '사용자 확인 필요' : '초안 생성';

    logAutomationStep_(
      runId,
      5,
      'run_agent_review_board',
      '벡터/루미/세이지/파일럿/노바',
      blockingCount > 0 ? 'warning' : 'success',
      `issue_date: ${targetIssueDate}`,
      `blocking_count: ${blockingCount}`,
      '',
      0
    );

    const readiness = evaluateAutomationReadiness();
    logAutomationStep_(
      runId,
      6,
      'evaluate_automation_readiness',
      '노바',
      'success',
      `issue_date: ${targetIssueDate}`,
      `quality_score: ${readiness.quality_score}`,
      '',
      0
    );

    const summary = [
      `Weekly Lab 워크플로 실행일: ${nowText_()}`,
      `run_id: ${runId}`,
      `issue_date: ${targetIssueDate}`,
      `문장 자동 순화: ${languageResult.updatedCellCount}개 셀`,
      `프롬프트 문서: ${promptResult.url}`,
      `새 가설 복기 예약: ${scheduledReviewCount}개`,
      `에이전트 차단 항목: ${blockingCount}개`,
      `자동화 준비도 점수: ${readiness.quality_score}`,
      `현재 상태: ${reportStatus}`,
      '이메일 발송 없음',
    ].join('\n');

    updateReportRunStatus_(promptResult.reportId, reportStatus, summary);
    finishAutomationRun_(runId, workflowStatus, promptResult.reportId, promptResult.url, '', '이메일 발송 없음. Weekly Lab 초안 준비 단계만 실행함.');

    try {
      qaReview = createOperatorQaReview_(runId, promptResult.reportId);
      logAutomationStep_(
        runId,
        7,
        'create_operator_qa_review',
        '오퍼레이터',
        'success',
        `report_id: ${promptResult.reportId}`,
        `qa_id: ${qaReview.qa_id}`,
        '',
        0
      );
    } catch (qaError) {
      logError_(runId, 'createOperatorQaReview_', 'medium', 'qa_review_error', qaError.message, 'QA 로그 생성 중 예외', 'qa_review_log와 workflow 로그를 함께 확인');
      finishAutomationRun_(runId, 'warning', promptResult.reportId, promptResult.url, qaError.message, 'QA 리뷰 생성 실패. qa_review_log 확인이 필요합니다.');
    }

    Logger.log(summary);
    return {
      run_id: runId,
      issue_date: targetIssueDate,
      report_id: promptResult.reportId,
      prompt_url: promptResult.url,
      blocking_count: blockingCount,
      scheduled_reviews: scheduledReviewCount,
      report_status: reportStatus,
      qa_review_id: qaReview ? qaReview.qa_id : '',
    };
  } catch (error) {
    logError_(runId, 'runWeeklyLabWorkflow', 'high', 'workflow_error', error.message, '워크플로 실행 중 예외', '로그 확인 후 재실행');
    finishAutomationRun_(runId, 'failed', promptResult ? promptResult.reportId : '', promptResult ? promptResult.url : '', error.message, '자동 복구 없음');
    throw error;
  }
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
  prepareSsmkWorkbook_();
  SpreadsheetApp.getUi().alert('SSMK 시트 구조 점검이 끝났습니다. 기존 데이터는 지우지 않았습니다.');
}

function prepareSsmkWorkbook_() {
  const ss = SpreadsheetApp.getActive();

  ensureControlCenterSheets_(ss);
  ensureWorkbookSchemaSheets_(ss);

  normalizeWatchlistColumns_(ss);
  setHeaders_(ss, SSMK.sheets.weeklyScores, SSMK.headers.weeklyScores);
  setHeaders_(ss, SSMK.sheets.scoreHistory, SSMK.headers.weeklyScores);
  applyWeeklyScoreFormulas_(ss);
  applyDropdowns_(ss);
  return {
    ok: true,
    issue_date: today_(),
  };
}

function ensureWorkbookSchemaSheets_(ss) {
  WORKBOOK_SCHEMA_SHEET_KEYS.forEach((key) => {
    setHeaders_(ss, SSMK.sheets[key], SSMK.headers[key]);
  });
}

function ensureControlCenterSheets_(ss) {
  ensureSheet_(ss, SSMK.sheets.userPreferences, 6);
  ensureSheet_(ss, SSMK.sheets.automationSchedules, 6);

  setHeaders_(ss, SSMK.sheets.userPreferences, [
    'setting_key',
    'setting_value',
    'setting_type',
    'description',
    'allowed_values',
    'user_editable',
  ]);
  setHeaders_(ss, SSMK.sheets.automationSchedules, [
    'schedule_key',
    'description',
    'enabled',
    'cadence',
    'last_run_at',
    'next_run_hint',
  ]);

  seedDefaultPreferences_(ss);
  seedDefaultSchedules_(ss);
}

function seedDefaultPreferences_(ss) {
  const existing = new Set(readObjects_(SSMK.sheets.userPreferences).map((row) => row.setting_key));
  CONTROL_CENTER_DEFAULT_PREFERENCES.forEach((setting) => {
    if (!existing.has(setting.setting_key)) {
      appendObject_(SSMK.sheets.userPreferences, [
        'setting_key',
        'setting_value',
        'setting_type',
        'description',
        'allowed_values',
        'user_editable',
      ], setting);
    }
  });
}

function seedDefaultSchedules_(ss) {
  const existing = new Set(readObjects_(SSMK.sheets.automationSchedules).map((row) => row.schedule_key));
  CONTROL_CENTER_DEFAULT_SCHEDULES.forEach((setting) => {
    if (!existing.has(setting.schedule_key)) {
      appendObject_(SSMK.sheets.automationSchedules, [
        'schedule_key',
        'description',
        'enabled',
        'cadence',
        'last_run_at',
        'next_run_hint',
      ], setting);
    }
  });
}

function getControlCenterState() {
  const ss = SpreadsheetApp.getActive();
  ensureControlCenterSheets_(ss);

  const preferences = readObjects_(SSMK.sheets.userPreferences).map((row) => ({
    setting_key: row.setting_key || '',
    setting_value: row.setting_value || '',
    setting_type: row.setting_type || '',
    description: row.description || '',
    allowed_values: parseAllowedValues_(row.allowed_values),
    user_editable: String(row.user_editable || '').toUpperCase() !== 'FALSE',
  }));

  const schedules = readObjects_(SSMK.sheets.automationSchedules).map((row) => ({
    schedule_key: row.schedule_key || '',
    description: row.description || '',
    enabled: normalizeOnOffText_(row.enabled),
    cadence: row.cadence || '',
    last_run_at: row.last_run_at || '',
    next_run_hint: row.next_run_hint || '',
  }));

  return {
    project_name: SSMK.projectName,
    disclaimer: SSMK.disclaimer,
    preferences: preferences,
    basic_preferences: preferences.filter((row) => !String(row.setting_key).startsWith('include_')),
    included_sections: preferences.filter((row) => String(row.setting_key).startsWith('include_')),
    schedules: schedules,
    log_locations: [
      '전체 실행 흐름: automation_run_log',
      '단계별 진행 상황: automation_step_log',
      '실제 에러 메시지: error_log',
      '최종 검사표: qa_review_log',
      '재작업 요청: revision_requests',
      '리포트 이력: report_sections, report_versions',
      '추가 검토 로그: agent_review_log, automation_stage_reviews, change_approval_log',
    ],
    revision_request_status: '재작업 요청은 revision_requests에 requested 상태로 저장됩니다.',
  };
}

function saveUserPreferences(preferences) {
  const ss = SpreadsheetApp.getActive();
  ensureControlCenterSheets_(ss);
  const sheet = ss.getSheetByName(SSMK.sheets.userPreferences);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const rows = readIndexedObjects_(SSMK.sheets.userPreferences);
  const existingByKey = new Map(rows.map((row) => [row.setting_key, row]));
  const incoming = normalizePreferencePayload_(preferences);
  const warnings = [];
  const updatedKeys = [];

  Object.keys(incoming).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(incoming, key)) return;
    const value = incoming[key];
    if (value === undefined || value === null) return;

    const existing = existingByKey.get(key);
    if (existing && String(existing.user_editable || '').toUpperCase() === 'FALSE') {
      warnings.push(`${key}는 잠금 설정이라 여기서 바꿀 수 없습니다.`);
      return;
    }

    const normalized = normalizePreferenceUpdate_(existing, key, value);
    if (normalized.warning) {
      warnings.push(normalized.warning);
      return;
    }
    if (normalized.value === undefined) return;

    if (key === 'email_auto_send') {
      const currentValue = normalizeOnOffText_(existing ? existing.setting_value : '');
      if (currentValue === 'OFF' && normalized.value === 'ON') {
        warnings.push('email_auto_send는 OFF에서 ON으로 바로 바뀌지 않습니다. 사람 승인 전에는 OFF를 유지합니다.');
        return;
      }
    }

    const rowObject = buildPreferenceRowObject_(existing, key, normalized.value);
    upsertRowByKey_(sheet, headers, 'setting_key', key, rowObject);
    updatedKeys.push(key);
  });

  return {
    ok: true,
    status: warnings.length > 0 ? 'warning' : 'ok',
    message: warnings.length > 0
      ? '일부 설정은 저장했지만, 몇 가지 항목은 경고 때문에 그대로 두었습니다.'
      : '리포트 기본 설정과 포함 섹션을 저장했습니다.',
    warnings: warnings,
    updated_keys: updatedKeys,
    state: getControlCenterState(),
  };
}

function saveScheduleSettings(schedules) {
  const ss = SpreadsheetApp.getActive();
  ensureControlCenterSheets_(ss);
  const sheet = ss.getSheetByName(SSMK.sheets.automationSchedules);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const rows = readIndexedObjects_(SSMK.sheets.automationSchedules);
  const existingByKey = new Map(rows.map((row) => [row.schedule_key, row]));
  const incoming = normalizeSchedulePayload_(schedules);
  const warnings = [];
  const updatedKeys = [];

  Object.keys(incoming).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(incoming, key)) return;
    const value = incoming[key];
    if (value === undefined || value === null) return;

    const normalized = normalizeOnOffText_(value);
    if (!normalized) {
      warnings.push(`${key}는 ON 또는 OFF로만 저장할 수 있습니다.`);
      return;
    }

    const existing = existingByKey.get(key);
    const rowObject = buildScheduleRowObject_(existing, key, normalized);
    upsertRowByKey_(sheet, headers, 'schedule_key', key, rowObject);
    updatedKeys.push(key);
  });

  return {
    ok: true,
    status: warnings.length > 0 ? 'warning' : 'ok',
    message: warnings.length > 0
      ? '일부 스케줄 정책은 저장했지만, 몇 가지 항목은 형식이 맞지 않아 그대로 두었습니다. 실제 Codex 예약 자동화는 아직 바뀌지 않았습니다.'
      : '자동화 스케줄 정책을 저장했습니다. 실제 Codex 예약 자동화는 아직 생성/수정되지 않았습니다.',
    warnings: warnings,
    updated_keys: updatedKeys,
    state: getControlCenterState(),
  };
}

function saveRevisionRequest(request) {
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);

  const normalized = normalizeRevisionRequest_(request);
  const requestId = `REV-${compactDate_(today_())}-${compactTime_()}-${String(new Date().getTime()).slice(-3)}`;

  appendObject_(SSMK.sheets.revisionRequests, SSMK.headers.revisionRequests, {
    request_id: requestId,
    report_id: normalized.report_id,
    target_scope: normalized.target_scope,
    target_section: normalized.target_section,
    request_type: normalized.request_type,
    user_instruction: normalized.user_instruction,
    status: 'requested',
    created_at: nowText_(),
    notes: 'SSMK Control Center에서 접수됨',
  });

  return {
    ok: true,
    request_id: requestId,
    status: 'requested',
    message: `재작업 요청을 접수했습니다. 요청 ID: ${requestId}`,
  };
}

function updateRevisionRequestState_(requestId, nextStatus, resultVersion, notes) {
  const normalizedRequestId = String(requestId || '').trim();
  const normalizedStatus = String(nextStatus || '').trim();
  const normalizedResultVersion = String(resultVersion || '').trim();
  const normalizedNotes = String(notes || '').trim();

  if (!normalizedRequestId) {
    throw new Error('request_id가 필요합니다.');
  }
  if (SSMK.dropdowns.requestStatus.indexOf(normalizedStatus) === -1) {
    throw new Error(`request status는 허용된 값만 사용할 수 있습니다: ${SSMK.dropdowns.requestStatus.join(', ')}`);
  }

  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);
  const sheet = ss.getSheetByName(SSMK.sheets.revisionRequests);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const rows = readIndexedObjects_(SSMK.sheets.revisionRequests);
  const existing = rows.find((row) => String(row.request_id) === normalizedRequestId);

  if (!existing) {
    throw new Error(`request_id를 찾을 수 없습니다: ${normalizedRequestId}`);
  }

  const processedStatuses = ['completed', 'blocked', 'cancelled'];
  const processedAt = processedStatuses.indexOf(normalizedStatus) !== -1 ? nowText_() : (existing.processed_at || '');
  const rowObject = {
    request_id: normalizedRequestId,
    status: normalizedStatus,
    processed_at: processedAt,
    result_version: normalizedResultVersion || existing.result_version || '',
    notes: normalizedNotes || existing.notes || '',
  };

  headers.forEach((header, index) => {
    if (!Object.prototype.hasOwnProperty.call(rowObject, header)) return;
    sheet.getRange(existing.__rowNumber, index + 1).setValue(rowObject[header]);
  });

  return {
    ok: true,
    request_id: normalizedRequestId,
    status: normalizedStatus,
    result_version: rowObject.result_version,
  };
}

function markRevisionRequestInProgress_(requestId, notes) {
  return updateRevisionRequestState_(requestId, 'in_progress', '', notes);
}

function completeRevisionRequest_(requestId, resultVersion, notes) {
  return updateRevisionRequestState_(requestId, 'completed', resultVersion, notes);
}

function recordRevisionRequestResult_(requestId, reportId, versionLabel, outputUrl, notes) {
  const normalizedRequestId = String(requestId || '').trim();
  const normalizedReportId = String(reportId || '').trim();
  const normalizedVersionLabel = String(versionLabel || '').trim();
  const normalizedOutputUrl = String(outputUrl || '').trim();
  const normalizedNotes = String(notes || '').trim() || '재작업 요청 처리 결과를 버전 이력에 기록했습니다.';

  if (!normalizedRequestId) {
    throw new Error('request_id가 필요합니다.');
  }
  if (!normalizedReportId) {
    throw new Error('report_id가 필요합니다.');
  }
  if (!normalizedVersionLabel) {
    throw new Error('version_label이 필요합니다. 예: v1.1');
  }

  markRevisionRequestInProgress_(normalizedRequestId, '재작업 결과를 기록하는 중입니다.');
  const version = createReportVersion_(normalizedReportId, normalizedVersionLabel, normalizedRequestId, normalizedOutputUrl, normalizedNotes);
  completeRevisionRequest_(normalizedRequestId, version.version_label, normalizedNotes);

  return {
    ok: true,
    request_id: normalizedRequestId,
    report_id: normalizedReportId,
    version_label: version.version_label,
  };
}

function upsertReportSection_(reportId, sectionKey, sectionTitle, status, contentSummary) {
  const normalized = normalizeReportSection_(reportId, sectionKey, sectionTitle, status, contentSummary);
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);

  const sheet = ss.getSheetByName(SSMK.sheets.reportSections);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const rows = readIndexedObjects_(SSMK.sheets.reportSections);
  const existing = rows.find((row) => (
    String(row.report_id) === normalized.report_id &&
    String(row.section_key) === normalized.section_key
  ));

  const rowObject = {
    report_id: normalized.report_id,
    section_key: normalized.section_key,
    section_title: normalized.section_title,
    section_order: existing ? existing.section_order : nextSectionOrder_(rows, normalized.report_id),
    status: normalized.status,
    content_summary: normalized.content_summary,
    current_version: existing ? existing.current_version : 'v1',
    last_updated_at: nowText_(),
    notes: existing ? existing.notes : '',
  };

  if (existing) {
    headers.forEach((header, index) => {
      if (!Object.prototype.hasOwnProperty.call(rowObject, header)) return;
      sheet.getRange(existing.__rowNumber, index + 1).setValue(rowObject[header]);
    });
    return {
      ok: true,
      action: 'updated',
      row_number: existing.__rowNumber,
      report_id: normalized.report_id,
      section_key: normalized.section_key,
    };
  }

  const row = headers.map((header) => Object.prototype.hasOwnProperty.call(rowObject, header) ? rowObject[header] : '');
  sheet.appendRow(row);
  return {
    ok: true,
    action: 'created',
    row_number: sheet.getLastRow(),
    report_id: normalized.report_id,
    section_key: normalized.section_key,
  };
}

function createReportVersion_(reportId, versionLabel, sourceRequestId, outputUrl, notes) {
  const normalized = normalizeReportVersion_(reportId, versionLabel, sourceRequestId, outputUrl, notes);
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);

  const existing = readObjects_(SSMK.sheets.reportVersions).find((row) => (
    row.report_id === normalized.report_id &&
    row.version_label === normalized.version_label
  ));
  if (existing) {
    throw new Error(`이미 같은 리포트 버전이 있습니다: ${normalized.report_id} ${normalized.version_label}`);
  }

  appendObject_(SSMK.sheets.reportVersions, SSMK.headers.reportVersions, {
    report_id: normalized.report_id,
    version_label: normalized.version_label,
    created_at: nowText_(),
    source_request_id: normalized.source_request_id,
    output_url: normalized.output_url,
    changed_sections: normalized.changed_sections,
    change_summary: normalized.change_summary,
    created_by: 'Apps Script',
    notes: normalized.notes,
  });

  return {
    ok: true,
    report_id: normalized.report_id,
    version_label: normalized.version_label,
  };
}

function startAutomationRun_(runType, scheduleKey, triggerSource) {
  const normalized = normalizeAutomationRunStart_(runType, scheduleKey, triggerSource);
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);

  const runId = `RUN-${compactDate_(today_())}-${compactTime_()}-${String(new Date().getTime()).slice(-3)}`;
  appendObject_(SSMK.sheets.automationRunLog, SSMK.headers.automationRunLog, {
    run_id: runId,
    run_type: normalized.run_type,
    started_at: nowText_(),
    status: 'running',
    trigger_source: normalized.trigger_source,
    schedule_key: normalized.schedule_key,
    notes: '실행 시작',
  });

  return runId;
}

function finishAutomationRun_(runId, status, reportId, finalOutputUrl, errorSummary, notes) {
  const normalized = normalizeAutomationRunFinish_(runId, status, reportId, finalOutputUrl, errorSummary, notes);
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);

  const sheet = ss.getSheetByName(SSMK.sheets.automationRunLog);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const rows = readIndexedObjects_(SSMK.sheets.automationRunLog);
  const existing = rows.find((row) => String(row.run_id) === normalized.run_id);

  if (!existing) {
    throw new Error(`run_id를 찾을 수 없습니다: ${normalized.run_id}`);
  }

  const endedAt = nowText_();
  const durationSec = calculateDurationSeconds_(existing.started_at, endedAt);
  const rowObject = {
    run_id: normalized.run_id,
    ended_at: endedAt,
    status: normalized.status,
    report_id: normalized.report_id,
    total_duration_sec: durationSec,
    final_output_url: normalized.final_output_url,
    error_summary: normalized.error_summary,
    notes: normalized.notes,
  };

  headers.forEach((header, index) => {
    if (!Object.prototype.hasOwnProperty.call(rowObject, header)) return;
    sheet.getRange(existing.__rowNumber, index + 1).setValue(rowObject[header]);
  });

  return {
    ok: true,
    run_id: normalized.run_id,
    status: normalized.status,
    total_duration_sec: durationSec,
  };
}

function logAutomationStep_(runId, stepOrder, stepName, agentName, status, inputSummary, outputSummary, errorMessage, retryCount) {
  const normalized = normalizeAutomationStep_(runId, stepOrder, stepName, agentName, status, inputSummary, outputSummary, errorMessage, retryCount);
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);
  const timestamp = nowText_();

  appendObject_(SSMK.sheets.automationStepLog, SSMK.headers.automationStepLog, {
    run_id: normalized.run_id,
    step_order: normalized.step_order,
    step_name: normalized.step_name,
    agent_name: normalized.agent_name,
    started_at: timestamp,
    ended_at: timestamp,
    duration_sec: 0,
    status: normalized.status,
    input_summary: normalized.input_summary,
    output_summary: normalized.output_summary,
    error_message: normalized.error_message,
    retry_count: normalized.retry_count,
  });

  return {
    ok: true,
    run_id: normalized.run_id,
    step_order: normalized.step_order,
    status: normalized.status,
  };
}

function logError_(runId, stepName, severity, errorType, errorMessage, rootCauseGuess, recoveryAction) {
  const normalized = normalizeErrorLog_(runId, stepName, severity, errorType, errorMessage, rootCauseGuess, recoveryAction);
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);
  const errorId = `ERR-${compactDate_(today_())}-${compactTime_()}-${String(new Date().getTime()).slice(-3)}`;

  appendObject_(SSMK.sheets.errorLog, SSMK.headers.errorLog, {
    error_id: errorId,
    occurred_at: nowText_(),
    run_id: normalized.run_id,
    step_name: normalized.step_name,
    severity: normalized.severity,
    error_type: normalized.error_type,
    error_message: normalized.error_message,
    root_cause_guess: normalized.root_cause_guess,
    recovery_action: normalized.recovery_action,
    resolved: 'FALSE',
  });

  return {
    ok: true,
    error_id: errorId,
    severity: normalized.severity,
  };
}

function logBottleneck_(runId, bottleneckType, location, symptom, impact, suggestedFix, priority, status) {
  const normalized = normalizeBottleneckLog_(runId, bottleneckType, location, symptom, impact, suggestedFix, priority, status);
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);

  appendObject_(SSMK.sheets.bottleneckLog, SSMK.headers.bottleneckLog, {
    detected_at: nowText_(),
    run_id: normalized.run_id,
    bottleneck_type: normalized.bottleneck_type,
    location: normalized.location,
    symptom: normalized.symptom,
    impact: normalized.impact,
    suggested_fix: normalized.suggested_fix,
    priority: normalized.priority,
    status: normalized.status,
  });

  return {
    ok: true,
    run_id: normalized.run_id,
    bottleneck_type: normalized.bottleneck_type,
    status: normalized.status,
  };
}

function createOperatorQaReview_(runId, reportId) {
  const normalized = normalizeOperatorQaReview_(runId, reportId);
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);

  const existingReview = readObjects_(SSMK.sheets.qaReviewLog)
    .find((row) => String(row.run_id) === normalized.run_id);
  if (existingReview) {
    throw new Error(`이미 같은 run_id의 QA 리뷰가 있습니다: ${normalized.run_id}`);
  }

  const run = readObjects_(SSMK.sheets.automationRunLog)
    .find((row) => String(row.run_id) === normalized.run_id);
  if (!run) {
    throw new Error(`run_id를 찾을 수 없습니다: ${normalized.run_id}`);
  }
  if (run.status === 'queued' || run.status === 'running') {
    throw new Error('아직 실행이 끝나지 않아 QA 리뷰를 만들 수 없습니다. automation_run_log.status를 먼저 확인하세요.');
  }
  if (run.report_id && String(run.report_id) !== normalized.report_id) {
    throw new Error(`run_id와 report_id 연결이 다릅니다. run:${normalized.run_id}, report:${normalized.report_id}`);
  }

  const report = findReportRun_(normalized.report_id);
  if (!report) {
    throw new Error(`report_id를 찾을 수 없습니다: ${normalized.report_id}`);
  }

  const issueDate = report.issue_date || '';
  const stepRows = readObjects_(SSMK.sheets.automationStepLog)
    .filter((row) => String(row.run_id) === normalized.run_id);
  const errorRows = readObjects_(SSMK.sheets.errorLog)
    .filter((row) => String(row.run_id) === normalized.run_id);
  const bottleneckRows = readObjects_(SSMK.sheets.bottleneckLog)
    .filter((row) => String(row.run_id) === normalized.run_id);
  const sectionRows = readObjects_(SSMK.sheets.reportSections)
    .filter((row) => String(row.report_id) === normalized.report_id);
  const visualizationRows = readObjects_(SSMK.sheets.visualizationQueue)
    .filter((row) => String(row.report_id) === normalized.report_id);
  const allAgentRows = readObjects_(SSMK.sheets.agentReviewLog);
  const exactRunRows = allAgentRows.filter((row) => String(row.run_id || '').trim() === normalized.run_id);
  const exactReportRows = exactRunRows.length === 0 && normalized.report_id
    ? allAgentRows.filter((row) => String(row.report_id || '').trim() === normalized.report_id)
    : [];
  const agentRows = exactRunRows.length > 0
    ? exactRunRows
    : exactReportRows.length > 0
      ? exactReportRows
      : issueDate
        ? allAgentRows.filter((row) => sameDateText_(row.issue_date, issueDate))
        : [];

  const overallStatus = deriveOperatorQaStatus_(run.status, stepRows, errorRows, bottleneckRows, sectionRows, visualizationRows, agentRows);
  const contentQualityScore = clampScore_(Math.round((
    scoreFromWorkflowStatus_(overallStatus) +
    scoreFromAgentReviewStatus_(findAgentReview_(agentRows, '루미')) +
    scoreFromAgentReviewStatus_(findAgentReview_(agentRows, '세이지')) +
    scoreFromSectionRows_(sectionRows)
  ) / 4));
  const dataQualityScore = clampScore_(Math.round((
    80 +
    scoreFromAgentReviewStatus_(findAgentReview_(agentRows, '벡터')) +
    scoreFromErrorRows_(errorRows)
  ) / 3));
  const visualizationQualityScore = scoreFromVisualizationRows_(visualizationRows);
  const processEfficiencyScore = scoreFromProcessRows_(run, stepRows, errorRows, bottleneckRows);
  const automationChangeNeeded = needsAutomationChange_(stepRows, errorRows, bottleneckRows) ? 'TRUE' : 'FALSE';
  const qaId = `QA-${compactDate_(today_())}-${compactTime_()}-${String(new Date().getTime()).slice(-3)}`;

  appendObject_(SSMK.sheets.qaReviewLog, SSMK.headers.qaReviewLog, {
    qa_id: qaId,
    run_id: normalized.run_id,
    review_date: today_(),
    overall_status: overallStatus,
    content_quality_score: contentQualityScore,
    data_quality_score: dataQualityScore,
    visualization_quality_score: visualizationQualityScore,
    process_efficiency_score: processEfficiencyScore,
    main_issues: summarizeOperatorQaIssues_(normalized.report_id, sectionRows, visualizationRows, errorRows, bottleneckRows, agentRows),
    recommended_next_action: recommendOperatorQaNextAction_(overallStatus, sectionRows, visualizationRows),
    automation_change_needed: automationChangeNeeded,
  });

  return {
    ok: true,
    qa_id: qaId,
    run_id: normalized.run_id,
    overall_status: overallStatus,
    automation_change_needed: automationChangeNeeded,
  };
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

function collectWeeklyLabPromptInputs_(issueDate, reportId, runId) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  const reportIssueDateById = new Map(
    readObjects_(SSMK.sheets.reportRuns)
      .map((row) => [String(row.report_id || ''), String(row.issue_date || '')])
      .filter((entry) => entry[0])
  );
  const pendingRevisionRequests = readObjects_(SSMK.sheets.revisionRequests)
    .filter((row) => row.status === 'requested')
    .filter((row) => {
      const requestReportId = String(row.report_id || '').trim();
      if (!requestReportId) return false;
      if (requestReportId === String(reportId || '').trim()) return true;
      const relatedIssueDate = reportIssueDateById.get(requestReportId);
      return relatedIssueDate ? sameDateText_(relatedIssueDate, targetIssueDate) : false;
    })
    .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')))
    .slice(-10);

  return {
    run_id: String(runId || '').trim(),
    report_id: String(reportId || '').trim(),
    issue_date: targetIssueDate,
    generated_at: nowText_(),
    reference_prompt_file: 'automation/codex-weekly-lab-automation-prompt.md',
    reference_template_file: 'templates/weekly-report-template.md',
    weekly_scores: readObjects_(SSMK.sheets.weeklyScores)
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate)),
    hypothesis_lab: readObjects_(SSMK.sheets.hypothesisLab)
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate)),
    visualization_queue: readObjects_(SSMK.sheets.visualizationQueue)
      .filter((row) => (
        String(row.report_id || '') === String(reportId || '') ||
        sameDateText_(row.issue_date, targetIssueDate)
      )),
    revision_requests: pendingRevisionRequests,
  };
}

function buildWeeklyLabPromptDocBody_(issueDate, reportId, runId) {
  const inputs = collectWeeklyLabPromptInputs_(issueDate, reportId, runId);

  return [
    'SSMK Weekly Lab automation input doc',
    '',
    `run_id: ${inputs.run_id}`,
    `report_id: ${inputs.report_id}`,
    `issue_date: ${inputs.issue_date}`,
    `generated_at: ${inputs.generated_at}`,
    '',
    '이 문서는 최종 리포트가 아니라, 현재는 수동 실행 참고용이고 나중에는 Codex 예약 자동화도 참고할 입력 프롬프트와 데이터 요약이다.',
    '',
    '기준 문서:',
    `- ${inputs.reference_prompt_file}`,
    `- ${inputs.reference_template_file}`,
    '',
    '이번 실행에서 반드시 지킬 것:',
    '- weekly_scores, hypothesis_lab, visualization_queue, revision_requests를 먼저 확인한다.',
    '- Google Docs 초안은 Weekly Lab 템플릿 구조를 그대로 따른다.',
    '- 에이전트 리뷰 보드는 최대 3회까지 반복한다.',
    '- 차단 항목이 남으면 사용자 확인 필요 상태로 정리한다.',
    '- 차단 항목이 없으면 현재 프로젝트에서 초안 생성 상태로 정리한다.',
    '- 이메일은 보내지 않는다.',
    '- 추가 과금 API는 호출하지 않는다.',
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

function createWeeklyLabPromptDoc_(issueDate, runId) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  const doc = DocumentApp.create(`SSMK weekly lab prompt - ${targetIssueDate}`);
  const reportId = createReportRunRow_(targetIssueDate, '', '', '준비', doc.getUrl(), 'Weekly Lab 입력 프롬프트 문서 생성');
  const prompt = buildWeeklyLabPromptDocBody_(targetIssueDate, reportId, runId);

  doc.getBody().setText(prompt);
  doc.saveAndClose();

  upsertReportSection_(reportId, 'weekly_lab_prompt', 'Weekly Lab Prompt Doc', 'draft', 'Codex 자동화가 읽을 입력 프롬프트와 데이터 요약');
  createReportVersion_(reportId, 'v1', '', doc.getUrl(), 'Weekly Lab prompt doc created');

  Logger.log(`Created weekly lab prompt doc: ${doc.getUrl()}`);
  Logger.log(`Created weekly lab report run: ${reportId}`);
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
  const rows = collectHypothesisSignalRows_(targetIssueDate);

  if (rows.length === 0) {
    throw new Error('복기 예약할 가설이 없습니다. weekly_scores 또는 hypothesis_lab에 가설을 먼저 입력하세요.');
  }

  const existingIds = new Set(readObjects_(SSMK.sheets.hypothesisReviews).map((row) => row.hypothesis_id));
  let createdCount = 0;

  rows.forEach((row, index) => {
    [
      { window: '1w', days: 7 },
      { window: '4w', days: 28 },
    ].forEach((review) => {
      const baseHypothesisId = String(row.hypothesis_id || `HYP-${compactDate_(targetIssueDate)}-${pad3_(index + 1)}`).trim();
      const hypothesisId = `${baseHypothesisId}-${review.window.toUpperCase()}`;
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

function runAgentReviewBoard(issueDate, runId, reportId) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  const hypothesisRows = collectHypothesisSignalRows_(targetIssueDate);
  const normalizedRunId = String(runId || '').trim();
  const normalizedReportId = String(reportId || '').trim();
  const reportTarget = normalizedReportId ? `report-${normalizedReportId}` : `weekly-report-${targetIssueDate}`;
  const checks = buildAgentChecks_(targetIssueDate, hypothesisRows);

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
      run_id: normalizedRunId,
      report_id: normalizedReportId,
    });
  });

  Logger.log(JSON.stringify(checks, null, 2));
  return checks;
}

function evaluateAutomationReadiness() {
  const today = today_();
  const weeklyRows = collectHypothesisSignalRows_();
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
    approval_status: 'proposed',
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

function buildAgentChecks_(issueDate, hypothesisRows) {
  const usesHypothesisLab = hypothesisRows.some((row) => String(row.source_sheet) === 'hypothesis_lab');
  const requiredCount = usesHypothesisLab ? 5 : 3;
  const sourceLabel = usesHypothesisLab ? 'hypothesis_lab' : 'weekly_scores';
  const completeRows = hypothesisRows.filter(hasCompleteHypothesis_);
  const lowConfidenceRows = hypothesisRows.filter((row) => row.data_confidence === '낮음');
  const recommendationRiskRows = hypothesisRows.filter((row) => {
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
      requiredAction: completeRows.length >= requiredCount ? '문장 가독성 확인' : `AI 가설 ${requiredCount}개를 핵심 필드와 함께 보완`,
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
      status: hypothesisRows.length > 0 ? 'pass' : 'warning',
      riskLevel: hypothesisRows.length > 0 ? 'low' : 'medium',
      blocking: false,
      summary: `issue_date ${issueDate} 기준 ${sourceLabel} 기반 가설 행 ${hypothesisRows.length}개`,
      requiredAction: hypothesisRows.length > 0 ? '가설 복기 예약 확인' : `${sourceLabel} 입력 후 다시 실행`,
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

function normalizeConfidenceGrade_(value) {
  const text = String(value || '').trim();
  if (text === '높음' || text === '중간' || text === '낮음') return text;
  if (/high/i.test(text)) return '높음';
  if (/low/i.test(text)) return '낮음';
  return '중간';
}

function confidenceToUncertainty_(value) {
  const grade = normalizeConfidenceGrade_(value);
  if (grade === '높음') return '낮음';
  if (grade === '낮음') return '높음';
  return '중간';
}

function mapWeeklyScoreToHypothesisSignalRow_(row, issueDate, index) {
  return {
    source_sheet: 'weekly_scores',
    issue_date: row.issue_date,
    hypothesis_id: `HYP-${compactDate_(issueDate)}-${pad3_(index + 1)}`,
    ticker: row.ticker || '',
    company: row.company || '',
    core_industry: row.core_industry || '',
    hypothesis_summary: row.hypothesis_summary || '',
    evidence_metrics: row.evidence_metrics || '',
    reasoning_explanation: row.reasoning_explanation || '',
    beginner_lesson: row.beginner_lesson || '',
    limitations: row.limitations || '',
    next_check: row.next_check || '',
    data_confidence: normalizeConfidenceGrade_(row.data_confidence),
    uncertainty_level: normalizeConfidenceGrade_(row.uncertainty_level),
  };
}

function mapHypothesisLabToSignalRow_(row, issueDate, index) {
  const confidence = normalizeConfidenceGrade_(row.confidence_level);
  const hypothesisId = String(row.hypothesis_id || `HLAB-${compactDate_(issueDate)}-${pad3_(index + 1)}`).trim();
  const summary = String(row.revised_hypothesis || row.one_line_forecast || '').trim();
  const reasoning = [row.interpretation, row.source_summary].filter(Boolean).join(' / ');

  return {
    source_sheet: 'hypothesis_lab',
    issue_date: row.issue_date,
    hypothesis_id: hypothesisId,
    ticker: String(row.related_tickers || '').trim(),
    company: '',
    core_industry: String(row.related_industry || '').trim(),
    hypothesis_summary: summary,
    evidence_metrics: String(row.evidence_metrics || '').trim(),
    reasoning_explanation: reasoning,
    beginner_lesson: String(row.beginner_lesson || '').trim(),
    limitations: String(row.red_team_challenge || '').trim(),
    next_check: String(row.review_condition || row.forecast_condition || '').trim(),
    data_confidence: confidence,
    uncertainty_level: confidenceToUncertainty_(confidence),
  };
}

function collectHypothesisSignalRows_(issueDate) {
  const weeklyRows = readObjects_(SSMK.sheets.weeklyScores);
  const labRows = readObjects_(SSMK.sheets.hypothesisLab);

  if (issueDate) {
    const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
    const targetLabRows = labRows.filter((row) => sameDateText_(row.issue_date, targetIssueDate));
    if (targetLabRows.length > 0) {
      return targetLabRows.map((row, index) => mapHypothesisLabToSignalRow_(row, targetIssueDate, index));
    }

    return weeklyRows
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate))
      .filter((row) => row.hypothesis_summary)
      .map((row, index) => mapWeeklyScoreToHypothesisSignalRow_(row, targetIssueDate, index));
  }

  const issueDatesWithLab = new Set(
    labRows
      .map((row) => String(row.issue_date || '').trim())
      .filter(Boolean)
  );

  return labRows
    .map((row, index) => mapHypothesisLabToSignalRow_(row, row.issue_date || today_(), index))
    .concat(
      weeklyRows
        .filter((row) => row.hypothesis_summary)
        .filter((row) => !issueDatesWithLab.has(String(row.issue_date || '').trim()))
        .map((row, index) => mapWeeklyScoreToHypothesisSignalRow_(row, row.issue_date || today_(), index))
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
  setDropdown_(ss, SSMK.sheets.sourcePolicy, 5, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.sourcePolicy, 9, SSMK.dropdowns.yesNo);

  setDropdown_(ss, SSMK.sheets.watchlist, 7, SSMK.dropdowns.riskLevel.map(capitalize_));
  setDropdown_(ss, SSMK.sheets.watchlist, 12, SSMK.dropdowns.yesNo);

  setDropdown_(ss, SSMK.sheets.weeklyScores, 15, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.weeklyScores, 18, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.weeklyScores, 19, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.weeklyScores, 28, SSMK.dropdowns.reviewStatus);

  setDropdown_(ss, SSMK.sheets.marketData, 9, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.companyFundamentals, 12, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.sectorThemeScores, 8, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.hypothesisLab, 17, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.hypothesisLab, 18, SSMK.dropdowns.hypothesisStatus);

  setDropdown_(ss, SSMK.sheets.hypothesisReviews, 16, SSMK.dropdowns.resultLabel);
  setDropdown_(ss, SSMK.sheets.hypothesisReviews, 19, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.hypothesisReviews, 20, SSMK.dropdowns.grade);
  setDropdown_(ss, SSMK.sheets.hypothesisReviews, 21, SSMK.dropdowns.hypothesisReviewStatus);

  setDropdown_(ss, SSMK.sheets.visualizationQueue, 9, SSMK.dropdowns.workflowStatus);
  setDropdown_(ss, SSMK.sheets.reportRuns, 5, SSMK.dropdowns.reportStatus);
  setDropdown_(ss, SSMK.sheets.reportSections, 5, SSMK.dropdowns.sectionStatus);
  setDropdown_(ss, SSMK.sheets.revisionRequests, 3, SSMK.dropdowns.requestScope);
  setDropdown_(ss, SSMK.sheets.revisionRequests, 5, SSMK.dropdowns.requestType);
  setDropdown_(ss, SSMK.sheets.revisionRequests, 7, SSMK.dropdowns.requestStatus);
  setDropdown_(ss, SSMK.sheets.automationStageReviews, 13, SSMK.dropdowns.approvalStatus);
  setDropdown_(ss, SSMK.sheets.changeApprovalLog, 9, SSMK.dropdowns.approvalStatus);
  setDropdown_(ss, SSMK.sheets.agentReviewLog, 6, SSMK.dropdowns.agentStatus);
  setDropdown_(ss, SSMK.sheets.agentReviewLog, 8, SSMK.dropdowns.riskLevel);
  setDropdown_(ss, SSMK.sheets.agentReviewLog, 10, SSMK.dropdowns.yesNo);
  setDropdown_(ss, SSMK.sheets.agentReviewLog, 11, SSMK.dropdowns.yesNo);
  setDropdown_(ss, SSMK.sheets.automationRunLog, 5, SSMK.dropdowns.workflowStatus);
  setDropdown_(ss, SSMK.sheets.automationStepLog, 8, SSMK.dropdowns.workflowStatus);
  setDropdown_(ss, SSMK.sheets.bottleneckLog, 8, SSMK.dropdowns.riskLevel);
  setDropdown_(ss, SSMK.sheets.bottleneckLog, 9, SSMK.dropdowns.workflowStatus);
  setDropdown_(ss, SSMK.sheets.errorLog, 5, SSMK.dropdowns.riskLevel);
  setDropdown_(ss, SSMK.sheets.errorLog, 10, SSMK.dropdowns.yesNo);
  setDropdown_(ss, SSMK.sheets.qaReviewLog, 4, SSMK.dropdowns.workflowStatus);
  setDropdown_(ss, SSMK.sheets.qaReviewLog, 11, SSMK.dropdowns.yesNo);
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

function readIndexedObjects_(sheetName) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet) return [];

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (lastRow < 2 || lastColumn < 1) return [];

  const values = sheet.getRange(1, 1, lastRow, lastColumn).getDisplayValues();
  const headers = values[0];
  return values.slice(1)
    .filter((row) => row.some((cell) => cell !== ''))
    .map((row, index) => {
      const item = {
        __rowNumber: index + 2,
      };
      headers.forEach((header, headerIndex) => {
        if (!header) return;
        item[header] = row[headerIndex] || '';
      });
      return item;
    });
}

function upsertRowByKey_(sheet, headers, keyHeader, keyValue, object) {
  const rows = readIndexedObjects_(sheet.getName());
  const existing = rows.find((row) => String(row[keyHeader]) === String(keyValue));
  if (existing) {
    headers.forEach((header, index) => {
      if (!Object.prototype.hasOwnProperty.call(object, header)) return;
      sheet.getRange(existing.__rowNumber, index + 1).setValue(object[header]);
    });
    return existing.__rowNumber;
  }

  const row = headers.map((header) => Object.prototype.hasOwnProperty.call(object, header) ? object[header] : '');
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function buildPreferenceRowObject_(existing, key, value) {
  return {
    setting_key: key,
    setting_value: value,
    setting_type: existing ? existing.setting_type : inferPreferenceType_(key, value),
    description: existing ? existing.description : '',
    allowed_values: existing ? existing.allowed_values : '',
    user_editable: existing ? existing.user_editable : 'TRUE',
  };
}

function buildScheduleRowObject_(existing, key, enabled) {
  return {
    schedule_key: key,
    description: existing ? existing.description : '',
    enabled: enabled,
    cadence: existing ? existing.cadence : '',
    last_run_at: existing ? existing.last_run_at : '',
    next_run_hint: existing ? existing.next_run_hint : '',
  };
}

function normalizePreferencePayload_(preferences) {
  if (!preferences) return {};
  if (Array.isArray(preferences)) {
    return preferences.reduce((acc, item) => {
      if (!item) return acc;
      if (Array.isArray(item) && item.length >= 2) {
        acc[String(item[0])] = item[1];
        return acc;
      }
      if (typeof item === 'object' && item.setting_key) {
        acc[String(item.setting_key)] = Object.prototype.hasOwnProperty.call(item, 'setting_value') ? item.setting_value : item.value;
      }
      return acc;
    }, {});
  }
  if (typeof preferences === 'object') return Object.assign({}, preferences);
  return {};
}

function normalizeSchedulePayload_(schedules) {
  if (!schedules) return {};
  if (Array.isArray(schedules)) {
    return schedules.reduce((acc, item) => {
      if (!item) return acc;
      if (Array.isArray(item) && item.length >= 2) {
        acc[String(item[0])] = item[1];
        return acc;
      }
      if (typeof item === 'object' && item.schedule_key) {
        acc[String(item.schedule_key)] = Object.prototype.hasOwnProperty.call(item, 'enabled') ? item.enabled : item.value;
      }
      return acc;
    }, {});
  }
  if (typeof schedules === 'object') return Object.assign({}, schedules);
  return {};
}

function normalizeRevisionRequest_(request) {
  if (!request || typeof request !== 'object') {
    throw new Error('재작업 요청 데이터가 비어 있습니다.');
  }

  const reportId = String(request.report_id || '').trim();
  const targetScope = String(request.target_scope || 'section').trim();
  const targetSection = String(request.target_section || '').trim();
  const requestType = String(request.request_type || '').trim();
  const userInstruction = String(request.user_instruction || '').trim();

  if (!reportId) {
    throw new Error('어느 리포트를 고칠지 report_id를 입력하세요. 예: RPT-20260428-12345');
  }
  if (SSMK.dropdowns.requestScope.indexOf(targetScope) === -1) {
    throw new Error(`target_scope는 ${SSMK.dropdowns.requestScope.join(', ')} 중 하나여야 합니다.`);
  }
  if (targetScope === 'section' && !targetSection) {
    throw new Error('특정 섹션 재작업은 어느 부분을 고칠지 입력해야 합니다.');
  }
  if (SSMK.dropdowns.requestType.indexOf(requestType) === -1) {
    throw new Error(`request_type은 허용된 값만 사용할 수 있습니다: ${SSMK.dropdowns.requestType.join(', ')}`);
  }
  if (!userInstruction) {
    throw new Error('추가 요청사항을 한 문장 이상 입력하세요.');
  }

  return {
    report_id: reportId,
    target_scope: targetScope,
    target_section: targetScope === 'section' ? targetSection : '',
    request_type: requestType,
    user_instruction: userInstruction,
  };
}

function normalizeReportSection_(reportId, sectionKey, sectionTitle, status, contentSummary) {
  const normalizedReportId = String(reportId || '').trim();
  const normalizedSectionKey = String(sectionKey || '').trim();
  const normalizedSectionTitle = String(sectionTitle || '').trim();
  const normalizedStatus = String(status || 'draft').trim();
  const normalizedSummary = String(contentSummary || '').trim();

  if (!normalizedReportId) {
    throw new Error('report_id가 필요합니다.');
  }
  if (!normalizedSectionKey) {
    throw new Error('section_key가 필요합니다.');
  }
  if (!normalizedSectionTitle) {
    throw new Error('section_title이 필요합니다.');
  }
  if (SSMK.dropdowns.sectionStatus.indexOf(normalizedStatus) === -1) {
    throw new Error(`section status는 허용된 값만 사용할 수 있습니다: ${SSMK.dropdowns.sectionStatus.join(', ')}`);
  }

  return {
    report_id: normalizedReportId,
    section_key: normalizedSectionKey,
    section_title: normalizedSectionTitle,
    status: normalizedStatus,
    content_summary: normalizedSummary,
  };
}

function normalizeReportVersion_(reportId, versionLabel, sourceRequestId, outputUrl, notes) {
  const normalizedReportId = String(reportId || '').trim();
  const normalizedVersionLabel = String(versionLabel || '').trim();
  const normalizedSourceRequestId = String(sourceRequestId || '').trim();
  const normalizedOutputUrl = String(outputUrl || '').trim();
  const normalizedNotes = String(notes || '').trim();

  if (!normalizedReportId) {
    throw new Error('report_id가 필요합니다.');
  }
  if (!/^v\d+(\.\d+)?$/i.test(normalizedVersionLabel)) {
    throw new Error('version_label은 v1, v2, v2.1 같은 형식으로 입력하세요.');
  }

  return {
    report_id: normalizedReportId,
    version_label: normalizedVersionLabel.toLowerCase(),
    source_request_id: normalizedSourceRequestId,
    output_url: normalizedOutputUrl,
    changed_sections: '',
    change_summary: normalizedNotes,
    notes: normalizedNotes,
  };
}

function nextSectionOrder_(rows, reportId) {
  const orders = rows
    .filter((row) => String(row.report_id) === String(reportId))
    .map((row) => Number(row.section_order))
    .filter((value) => !Number.isNaN(value));
  return orders.length === 0 ? 1 : Math.max.apply(null, orders) + 1;
}

function normalizeAutomationRunStart_(runType, scheduleKey, triggerSource) {
  const normalizedRunType = String(runType || '').trim();
  const normalizedScheduleKey = String(scheduleKey || '').trim();
  const normalizedTriggerSource = String(triggerSource || 'manual').trim();

  if (!normalizedRunType) {
    throw new Error('run_type이 필요합니다. 예: weekly_lab');
  }

  return {
    run_type: normalizedRunType,
    schedule_key: normalizedScheduleKey,
    trigger_source: normalizedTriggerSource,
  };
}

function normalizeAutomationRunFinish_(runId, status, reportId, finalOutputUrl, errorSummary, notes) {
  const normalizedRunId = String(runId || '').trim();
  const normalizedStatus = normalizeWorkflowStatus_(status);

  if (!normalizedRunId) {
    throw new Error('run_id가 필요합니다.');
  }
  if (!normalizedStatus) {
    throw new Error(`status는 허용된 값만 사용할 수 있습니다: ${SSMK.dropdowns.workflowStatus.join(', ')}`);
  }

  return {
    run_id: normalizedRunId,
    status: normalizedStatus,
    report_id: String(reportId || '').trim(),
    final_output_url: String(finalOutputUrl || '').trim(),
    error_summary: String(errorSummary || '').trim(),
    notes: String(notes || '').trim(),
  };
}

function normalizeWorkflowStatus_(status) {
  const text = String(status || '').trim();
  const aliases = {
    '초안 생성 준비 완료': 'success',
    '초안 생성': 'success',
    '발행 가능': 'success',
    '사용자 확인 필요': 'warning',
    '발행 보류 권장': 'blocked',
    '실패': 'failed',
  };
  const normalized = aliases[text] || text.toLowerCase();
  return SSMK.dropdowns.workflowStatus.indexOf(normalized) === -1 ? '' : normalized;
}

function calculateDurationSeconds_(startedAtText, endedAtText) {
  const startedAt = parseDateTimeText_(startedAtText);
  const endedAt = parseDateTimeText_(endedAtText);
  if (!startedAt || !endedAt) return '';
  return Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000));
}

function parseDateTimeText_(text) {
  const match = String(text || '').match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return null;
  return new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6])
  );
}

function normalizeAutomationStep_(runId, stepOrder, stepName, agentName, status, inputSummary, outputSummary, errorMessage, retryCount) {
  const normalizedRunId = String(runId || '').trim();
  const normalizedStepOrder = Number(stepOrder);
  const normalizedStepName = String(stepName || '').trim();
  const normalizedAgentName = String(agentName || '').trim();
  const normalizedStatus = normalizeWorkflowStatus_(status);
  const normalizedRetryCount = retryCount === undefined || retryCount === null || retryCount === ''
    ? 0
    : Number(retryCount);

  if (!normalizedRunId) {
    throw new Error('run_id가 필요합니다.');
  }
  if (!Number.isInteger(normalizedStepOrder) || normalizedStepOrder < 1) {
    throw new Error('step_order는 1 이상의 정수여야 합니다.');
  }
  if (!normalizedStepName) {
    throw new Error('step_name이 필요합니다.');
  }
  if (!normalizedAgentName) {
    throw new Error('agent_name이 필요합니다.');
  }
  if (!normalizedStatus) {
    throw new Error(`step status는 허용된 값만 사용할 수 있습니다: ${SSMK.dropdowns.workflowStatus.join(', ')}`);
  }
  if (!Number.isInteger(normalizedRetryCount) || normalizedRetryCount < 0) {
    throw new Error('retry_count는 0 이상의 정수여야 합니다.');
  }

  return {
    run_id: normalizedRunId,
    step_order: normalizedStepOrder,
    step_name: normalizedStepName,
    agent_name: normalizedAgentName,
    status: normalizedStatus,
    input_summary: String(inputSummary || '').trim(),
    output_summary: String(outputSummary || '').trim(),
    error_message: String(errorMessage || '').trim(),
    retry_count: normalizedRetryCount,
  };
}

function normalizeErrorLog_(runId, stepName, severity, errorType, errorMessage, rootCauseGuess, recoveryAction) {
  const normalizedRunId = String(runId || '').trim();
  const normalizedStepName = String(stepName || '').trim();
  const normalizedSeverity = String(severity || 'medium').trim().toLowerCase();
  const normalizedErrorType = String(errorType || '').trim();
  const normalizedErrorMessage = String(errorMessage || '').trim();

  if (!normalizedRunId) {
    throw new Error('run_id가 필요합니다.');
  }
  if (!normalizedStepName) {
    throw new Error('step_name이 필요합니다.');
  }
  if (SSMK.dropdowns.riskLevel.indexOf(normalizedSeverity) === -1) {
    throw new Error(`severity는 허용된 값만 사용할 수 있습니다: ${SSMK.dropdowns.riskLevel.join(', ')}`);
  }
  if (!normalizedErrorType) {
    throw new Error('error_type이 필요합니다.');
  }
  if (!normalizedErrorMessage) {
    throw new Error('error_message가 필요합니다.');
  }

  return {
    run_id: normalizedRunId,
    step_name: normalizedStepName,
    severity: normalizedSeverity,
    error_type: normalizedErrorType,
    error_message: normalizedErrorMessage,
    root_cause_guess: String(rootCauseGuess || '').trim(),
    recovery_action: String(recoveryAction || '').trim(),
  };
}

function normalizeBottleneckLog_(runId, bottleneckType, location, symptom, impact, suggestedFix, priority, status) {
  const normalizedRunId = String(runId || '').trim();
  const normalizedBottleneckType = String(bottleneckType || '').trim();
  const normalizedLocation = String(location || '').trim();
  const normalizedSymptom = String(symptom || '').trim();
  const normalizedPriority = String(priority || 'medium').trim().toLowerCase();
  const normalizedStatus = normalizeWorkflowStatus_(status || 'warning');

  if (!normalizedRunId) {
    throw new Error('run_id가 필요합니다.');
  }
  if (!normalizedBottleneckType) {
    throw new Error('bottleneck_type이 필요합니다.');
  }
  if (!normalizedLocation) {
    throw new Error('location이 필요합니다.');
  }
  if (!normalizedSymptom) {
    throw new Error('symptom이 필요합니다.');
  }
  if (SSMK.dropdowns.riskLevel.indexOf(normalizedPriority) === -1) {
    throw new Error(`priority는 허용된 값만 사용할 수 있습니다: ${SSMK.dropdowns.riskLevel.join(', ')}`);
  }
  if (!normalizedStatus) {
    throw new Error(`bottleneck status는 허용된 값만 사용할 수 있습니다: ${SSMK.dropdowns.workflowStatus.join(', ')}`);
  }

  return {
    run_id: normalizedRunId,
    bottleneck_type: normalizedBottleneckType,
    location: normalizedLocation,
    symptom: normalizedSymptom,
    impact: String(impact || '').trim(),
    suggested_fix: String(suggestedFix || '').trim(),
    priority: normalizedPriority,
    status: normalizedStatus,
  };
}

function normalizeOperatorQaReview_(runId, reportId) {
  const normalizedRunId = String(runId || '').trim();
  const normalizedReportId = String(reportId || '').trim();

  if (!normalizedRunId) {
    throw new Error('run_id가 필요합니다.');
  }
  if (!normalizedReportId) {
    throw new Error('report_id가 필요합니다.');
  }

  return {
    run_id: normalizedRunId,
    report_id: normalizedReportId,
  };
}

function normalizePreferenceUpdate_(existing, key, value) {
  const type = String(existing && existing.setting_type ? existing.setting_type : inferPreferenceType_(key, value)).toLowerCase();
  const allowedValues = existing ? parseAllowedValues_(existing.allowed_values) : [];

  if (type === 'switch') {
    const normalized = normalizeOnOffText_(value);
    if (!normalized) {
      return { warning: `${key}는 ON 또는 OFF로만 저장할 수 있습니다.` };
    }
    return { value: normalized };
  }

  if (type === 'number') {
    const text = String(value).trim();
    if (text === '' || !/^[-+]?\d+(\.\d+)?$/.test(text)) {
      return { warning: `${key}는 숫자만 저장할 수 있습니다.` };
    }
    return { value: text };
  }

  const text = String(value).trim();
  if (type === 'select' && allowedValues.length > 0 && allowedValues.indexOf(text) === -1) {
    return { warning: `${key}는 허용된 값만 저장할 수 있습니다: ${allowedValues.join(', ')}` };
  }
  return { value: text };
}

function inferPreferenceType_(key, value) {
  if (/^include_/.test(key) || /auto_send|approval/.test(key)) return 'switch';
  if (typeof value === 'number' || /^[-+]?\d+(\.\d+)?$/.test(String(value).trim())) return 'number';
  return 'text';
}

function parseAllowedValues_(text) {
  return String(text || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeOnOffText_(value) {
  const text = String(value === true ? 'ON' : value === false ? 'OFF' : value || '').trim().toUpperCase();
  if (text === 'TRUE') return 'ON';
  if (text === 'FALSE') return 'OFF';
  if (text === 'ON' || text === 'OFF') return text;
  return '';
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
    email_subject: `[SSMK] Weekly Lab ${issueDate}`,
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

function deriveOperatorQaStatus_(runStatus, stepRows, errorRows, bottleneckRows, sectionRows, visualizationRows, agentRows) {
  const normalizedRunStatus = normalizeWorkflowStatus_(runStatus) || String(runStatus || '').trim().toLowerCase();
  const hasFailedStep = stepRows.some((row) => normalizeWorkflowStatus_(row.status) === 'failed');
  const hasBlockedStep = stepRows.some((row) => normalizeWorkflowStatus_(row.status) === 'blocked');
  const hasHighSeverityError = errorRows.some((row) => String(row.severity || '').trim().toLowerCase() === 'high');
  const hasBlockedBottleneck = bottleneckRows.some((row) => normalizeWorkflowStatus_(row.status) === 'blocked');
  const hasSectionRevision = sectionRows.some((row) => String(row.status || '').trim().toLowerCase() === 'needs_revision');
  const hasOpenVisualization = visualizationRows.some((row) => {
    const status = normalizeWorkflowStatus_(row.status) || String(row.status || '').trim().toLowerCase();
    return status && status !== 'success' && status !== 'skipped';
  });
  const hasBlockedAgent = agentRows.some((row) => String(row.status || '').trim().toLowerCase() === 'block');
  const hasWarningSignals = (
    stepRows.some((row) => normalizeWorkflowStatus_(row.status) === 'warning') ||
    errorRows.length > 0 ||
    bottleneckRows.length > 0 ||
    hasSectionRevision ||
    hasOpenVisualization ||
    agentRows.some((row) => String(row.status || '').trim().toLowerCase() === 'warning')
  );

  if (normalizedRunStatus === 'failed' || hasFailedStep) return 'failed';
  if (normalizedRunStatus === 'blocked' || hasBlockedStep || hasHighSeverityError || hasBlockedBottleneck || hasBlockedAgent) return 'blocked';
  if (normalizedRunStatus === 'warning' || hasWarningSignals) return 'warning';
  if (normalizedRunStatus === 'success') return 'success';
  return 'warning';
}

function findAgentReview_(agentRows, agentName) {
  return agentRows.find((row) => String(row.agent_name || '').trim() === agentName);
}

function scoreFromAgentReviewStatus_(reviewRow) {
  if (!reviewRow) return 75;
  const status = String(reviewRow.status || '').trim().toLowerCase();
  const scores = {
    pass: 90,
    warning: 70,
    block: 40,
    proposal: 75,
  };
  return Object.prototype.hasOwnProperty.call(scores, status) ? scores[status] : 75;
}

function scoreFromWorkflowStatus_(status) {
  const normalizedStatus = normalizeWorkflowStatus_(status) || String(status || '').trim().toLowerCase();
  const scores = {
    success: 90,
    warning: 75,
    blocked: 55,
    failed: 35,
    running: 60,
    queued: 60,
    skipped: 80,
  };
  return Object.prototype.hasOwnProperty.call(scores, normalizedStatus) ? scores[normalizedStatus] : 70;
}

function scoreFromSectionRows_(sectionRows) {
  if (!sectionRows || sectionRows.length === 0) return 70;

  let score = 80;
  sectionRows.forEach((row) => {
    const status = String(row.status || '').trim().toLowerCase();
    if (status === 'approved') score += 4;
    if (status === 'draft') score -= 3;
    if (status === 'needs_revision') score -= 12;
    if (status === 'archived') score -= 2;
  });
  return clampScore_(score);
}

function scoreFromErrorRows_(errorRows) {
  if (!errorRows || errorRows.length === 0) return 90;

  let score = 90;
  errorRows.forEach((row) => {
    const severity = String(row.severity || '').trim().toLowerCase();
    if (severity === 'high') score -= 25;
    else if (severity === 'medium') score -= 15;
    else score -= 8;
  });
  return clampScore_(score);
}

function scoreFromVisualizationRows_(visualizationRows) {
  if (!visualizationRows || visualizationRows.length === 0) return 70;

  let score = 90;
  visualizationRows.forEach((row) => {
    const status = normalizeWorkflowStatus_(row.status) || String(row.status || '').trim().toLowerCase();
    if (status === 'success') return;
    if (status === 'warning') score -= 10;
    else if (status === 'blocked' || status === 'failed') score -= 20;
    else score -= 5;
  });
  return clampScore_(score);
}

function scoreFromProcessRows_(run, stepRows, errorRows, bottleneckRows) {
  let score = scoreFromWorkflowStatus_(run.status);
  const retryTotal = stepRows.reduce((sum, row) => sum + (Number(row.retry_count) || 0), 0);
  const failedOrBlockedSteps = stepRows.filter((row) => {
    const status = normalizeWorkflowStatus_(row.status);
    return status === 'failed' || status === 'blocked';
  }).length;
  const warningSteps = stepRows.filter((row) => normalizeWorkflowStatus_(row.status) === 'warning').length;
  const durationSec = Number(run.total_duration_sec || 0);

  score -= failedOrBlockedSteps * 12;
  score -= warningSteps * 5;
  score -= retryTotal * 3;
  score -= errorRows.length * 10;
  score -= bottleneckRows.length * 8;
  if (durationSec >= 1800) score -= 10;
  if (durationSec >= 3600) score -= 10;

  return clampScore_(score);
}

function summarizeOperatorQaIssues_(reportId, sectionRows, visualizationRows, errorRows, bottleneckRows, agentRows) {
  const issues = [];
  const needsRevisionCount = sectionRows.filter((row) => String(row.status || '').trim().toLowerCase() === 'needs_revision').length;
  const highErrorCount = errorRows.filter((row) => String(row.severity || '').trim().toLowerCase() === 'high').length;
  const blockedBottleneckCount = bottleneckRows.filter((row) => normalizeWorkflowStatus_(row.status) === 'blocked').length;
  const openVisualizationCount = visualizationRows.filter((row) => {
    const status = normalizeWorkflowStatus_(row.status) || String(row.status || '').trim().toLowerCase();
    return status && status !== 'success' && status !== 'skipped';
  }).length;
  const blockedAgents = agentRows
    .filter((row) => String(row.status || '').trim().toLowerCase() === 'block')
    .map((row) => row.agent_name);
  const warningAgentCount = agentRows
    .filter((row) => String(row.status || '').trim().toLowerCase() === 'warning')
    .length;

  if (sectionRows.length === 0) {
    issues.push(`report_sections에 ${reportId} 기록이 아직 없습니다`);
  } else if (needsRevisionCount > 0) {
    issues.push(`재작업 필요 섹션 ${needsRevisionCount}개`);
  }

  if (highErrorCount > 0) issues.push(`고심각도 오류 ${highErrorCount}개`);
  else if (errorRows.length > 0) issues.push(`오류 로그 ${errorRows.length}개`);

  if (blockedBottleneckCount > 0) issues.push(`차단 병목 ${blockedBottleneckCount}개`);
  else if (bottleneckRows.length > 0) issues.push(`병목 후보 ${bottleneckRows.length}개`);

  if (visualizationRows.length === 0) issues.push('시각화 큐가 아직 비어 있습니다');
  else if (openVisualizationCount > 0) issues.push(`완료 전 시각화 ${openVisualizationCount}개`);

  if (blockedAgents.length > 0) issues.push(`${blockedAgents.join(', ')} 검토에서 차단 의견`);
  else if (warningAgentCount > 0) issues.push(`경고 검토 ${warningAgentCount}개`);

  return issues.length > 0 ? issues.join('; ') : '큰 차단 이슈 없음';
}

function recommendOperatorQaNextAction_(overallStatus, sectionRows, visualizationRows) {
  if (overallStatus === 'failed' || overallStatus === 'blocked') {
    return 'error_log와 bottleneck_log를 먼저 확인하고, 막힌 항목을 정리한 뒤 QA 리뷰를 다시 만드세요.';
  }
  if (overallStatus === 'warning') {
    if (sectionRows.some((row) => String(row.status || '').trim().toLowerCase() === 'needs_revision')) {
      return 'report_sections에서 needs_revision 섹션을 먼저 보완한 뒤, qa_review_log 점수를 다시 확인하세요.';
    }
    if (visualizationRows.length === 0) {
      return '시각화가 필요한 섹션이 있는지 확인하고, visualization_queue 기록 여부를 점검하세요.';
    }
    return 'main_issues에 적힌 경고를 먼저 정리하고, 리포트 본문을 한 번 더 읽어 표현을 확인하세요.';
  }
  return '큰 차단 이슈가 없으면 최종 문안과 로그를 한 번 더 확인한 뒤 다음 단계로 넘길 수 있습니다.';
}

function needsAutomationChange_(stepRows, errorRows, bottleneckRows) {
  const retryTotal = stepRows.reduce((sum, row) => sum + (Number(row.retry_count) || 0), 0);
  const hasFailedOrBlockedStep = stepRows.some((row) => {
    const status = normalizeWorkflowStatus_(row.status);
    return status === 'failed' || status === 'blocked';
  });
  const hasHighSeverityError = errorRows.some((row) => String(row.severity || '').trim().toLowerCase() === 'high');
  return hasFailedOrBlockedStep || hasHighSeverityError || bottleneckRows.length > 0 || retryTotal >= 2;
}

function clampScore_(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
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

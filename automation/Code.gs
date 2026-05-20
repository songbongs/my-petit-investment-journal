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
    reportBlueprint: 'report_blueprint',
    reportFactCards: 'report_fact_cards',
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
    reportBlueprint: [
      'section_key',
      'section_order',
      'section_title',
      'required',
      'enabled',
      'docs_output',
      'email_output',
      'data_sources',
      'quality_rule',
      'beginner_purpose',
      'notes',
      'visible_title_ko',
    ],
    reportFactCards: [
      'fact_id',
      'issue_date',
      'report_id',
      'section_key',
      'ticker',
      'asset_type',
      'fact_type',
      'metric_name',
      'period',
      'value',
      'unit',
      'comparison_value',
      'comparison_label',
      'source_key',
      'source_url',
      'source_date',
      'data_confidence',
      'data_status',
      'missing_reason',
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
      'report_id',
      'html_version_id',
      'source_snapshot_id',
      'checked_by',
      'blocked_count',
      'warning_count',
      'qc_score_breakdown',
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

const WORKBOOK_SCHEMA_SHEET_GROUPS = [
  [
    'sourcePolicy',
    'marketData',
    'companyFundamentals',
    'revenueBreakdown',
    'shareholderReturns',
    'insiderActivity',
    'etfWatch',
    'sectorThemeScores',
  ],
  [
    'hypothesisLab',
    'hypothesisReviews',
    'hypothesisEvolutionLog',
    'visualizationQueue',
    'reportBlueprint',
    'reportFactCards',
    'reportRuns',
    'reportSections',
    'reportVersions',
    'revisionRequests',
  ],
  [
    'automationStageReviews',
    'changeApprovalLog',
    'agentReviewLog',
    'automationRunLog',
    'automationStepLog',
    'bottleneckLog',
    'errorLog',
    'qaReviewLog',
    'glossary',
  ],
];

const WORKBOOK_SETUP_LIMITS = {
  dropdownBufferRows: 100,
  minDropdownRows: 200,
  maxDropdownRows: 300,
};

const SSMK_SETUP_BUILD = '2026-05-07-quality-architecture-v3';

const WATCHLIST_CLASSIFICATION_GUIDE = [
  {
    ticker: 'TSLA',
    company: 'Tesla',
    core_industry: '자동차/전기차',
    theme_tags: '전기차, 자율주행, 에너지 저장, 로봇, 가격 경쟁',
    investment_style: '성장주, 경기민감',
    role_in_watchlist: '전기차 수요, 가격 정책, 자율주행/에너지 사업의 실질 기여도를 관찰',
    tracking_priority: 'High',
  },
  {
    ticker: 'GM',
    company: 'General Motors',
    core_industry: '자동차/전기차',
    theme_tags: '전통 자동차, 전기차 전환, 자율주행, 경기민감',
    investment_style: '경기민감, 턴어라운드',
    role_in_watchlist: '전통 완성차 기업이 전기차 전환과 수익성 방어를 어떻게 진행하는지 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'MSFT',
    company: 'Microsoft',
    core_industry: 'AI/클라우드/반도체 인프라',
    theme_tags: 'AI, 클라우드, Azure, Microsoft 365, Copilot, 게임, Xbox/Activision, 주주환원',
    investment_style: '성장주, 혼합, 플랫폼',
    role_in_watchlist: 'Azure/Microsoft 365/Copilot 중심의 클라우드·AI 플랫폼. Xbox/Activision은 콘텐츠·구독 확장 사례로 함께 관찰',
    tracking_priority: 'High',
  },
  {
    ticker: 'TTWO',
    company: 'Take-Two Interactive',
    core_industry: '미디어/게임/콘텐츠',
    theme_tags: '게임, GTA, 콘솔 사이클, 모바일 게임, 콘텐츠 IP',
    investment_style: '성장주, 경기민감',
    role_in_watchlist: '대형 게임 출시 주기와 장기 IP 가치가 실적 변동에 미치는 영향 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'NFLX',
    company: 'Netflix',
    core_industry: '미디어/게임/콘텐츠',
    theme_tags: '스트리밍, 광고 요금제, 콘텐츠, 글로벌 구독',
    investment_style: '성장주, 플랫폼',
    role_in_watchlist: '구독·광고 모델이 콘텐츠 비용과 수익성에 어떻게 연결되는지 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'DIS',
    company: 'Walt Disney',
    core_industry: '미디어/게임/콘텐츠',
    theme_tags: '스트리밍, 테마파크, 콘텐츠 IP, ESPN, 턴어라운드',
    investment_style: '턴어라운드, 소비재, 혼합',
    role_in_watchlist: '스트리밍 수익성, 테마파크, 콘텐츠 IP 회복 흐름을 함께 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'AAPL',
    company: 'Apple',
    core_industry: 'AI/클라우드/반도체 인프라',
    theme_tags: '온디바이스 AI, iPhone, 서비스, 생태계, 주주환원',
    investment_style: '혼합, 플랫폼, 주주환원',
    role_in_watchlist: '하드웨어·서비스 생태계와 온디바이스 AI가 반복 매출과 사용자 충성도에 미치는 영향 관찰',
    tracking_priority: 'High',
  },
  {
    ticker: 'NVDA',
    company: 'NVIDIA',
    core_industry: 'AI/클라우드/반도체 인프라',
    theme_tags: 'AI 반도체, GPU, 데이터센터, 가속 컴퓨팅, CUDA',
    investment_style: '성장주, 경기민감',
    role_in_watchlist: 'AI 인프라 수요가 반도체 매출과 마진에 어떻게 연결되는지 관찰',
    tracking_priority: 'High',
  },
  {
    ticker: 'QCOM',
    company: 'Qualcomm',
    core_industry: 'AI/클라우드/반도체 인프라',
    theme_tags: '모바일 반도체, 온디바이스 AI, 자동차 반도체, 통신칩',
    investment_style: '성장주, 경기민감, 혼합',
    role_in_watchlist: '스마트폰 이후 자동차·온디바이스 AI로 사업 축이 넓어지는지 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'EL',
    company: 'Estee Lauder',
    core_industry: '글로벌 소비재/럭셔리',
    theme_tags: '화장품, 중국 소비, 럭셔리, 마진 회복, 턴어라운드',
    investment_style: '소비재, 턴어라운드',
    role_in_watchlist: '중국·면세 채널과 브랜드 회복이 매출/마진에 어떻게 반영되는지 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'LVMUY',
    company: 'LVMH Moet Hennessy Louis Vuitton ADR',
    core_industry: '글로벌 소비재/럭셔리',
    theme_tags: '럭셔리, 중국 소비, 브랜드 파워, 유럽 소비, 마진',
    investment_style: '소비재, 혼합',
    role_in_watchlist: '럭셔리 브랜드 포트폴리오와 지역별 소비 흐름을 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'GOOGL',
    company: 'Alphabet',
    core_industry: '디지털 플랫폼/광고',
    theme_tags: '검색 광고, YouTube, 클라우드, AI, Gemini',
    investment_style: '성장주, 플랫폼',
    role_in_watchlist: '검색·광고 기반 현금흐름과 AI 전환, 클라우드 성장을 함께 관찰',
    tracking_priority: 'High',
  },
  {
    ticker: 'META',
    company: 'Meta Platforms',
    core_industry: '디지털 플랫폼/광고',
    theme_tags: '소셜 광고, Instagram, WhatsApp, AI 광고 도구, Reality Labs',
    investment_style: '성장주, 플랫폼',
    role_in_watchlist: '광고 플랫폼 효율과 AI 추천/광고 도구가 실적에 미치는 영향 관찰',
    tracking_priority: 'High',
  },
  {
    ticker: 'TTD',
    company: 'The Trade Desk',
    core_industry: '디지털 플랫폼/광고',
    theme_tags: '광고 기술, 커넥티드 TV, 오픈 인터넷, 데이터 광고',
    investment_style: '성장주, 플랫폼',
    role_in_watchlist: '대형 플랫폼 밖 광고 시장에서 독립 광고 기술 기업의 성장성을 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'JNJ',
    company: 'Johnson & Johnson',
    core_industry: '헬스케어/제약',
    theme_tags: '제약, 의료기기, 방어주, 배당',
    investment_style: '방어주, 배당주',
    role_in_watchlist: '경기와 무관한 헬스케어 수요, 배당 지속성, 파이프라인 안정성을 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'LLY',
    company: 'Eli Lilly',
    core_industry: '헬스케어/제약',
    theme_tags: '비만 치료제, 당뇨, 신약, 파이프라인',
    investment_style: '성장주, 헬스케어',
    role_in_watchlist: '신약 성장성과 생산능력, 기대가 실적 지표로 이어지는지 관찰',
    tracking_priority: 'High',
  },
  {
    ticker: 'MRK',
    company: 'Merck',
    core_industry: '헬스케어/제약',
    theme_tags: '면역항암제, 신약, 특허 만료, 배당',
    investment_style: '방어주, 배당주, 혼합',
    role_in_watchlist: '주요 의약품 의존도와 후속 파이프라인이 장기 안정성에 미치는 영향 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'XOM',
    company: 'Exxon Mobil',
    core_industry: '에너지/산업소재',
    theme_tags: '석유, 천연가스, 현금흐름, 배당, 자사주',
    investment_style: '배당주, 경기민감',
    role_in_watchlist: '유가와 현금흐름이 배당·자사주 정책에 어떻게 연결되는지 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'CVX',
    company: 'Chevron',
    core_industry: '에너지/산업소재',
    theme_tags: '석유, 천연가스, 배당, 자본지출, 에너지 가격',
    investment_style: '배당주, 경기민감',
    role_in_watchlist: '에너지 가격 변동 속에서 현금흐름과 주주환원 안정성을 관찰',
    tracking_priority: 'Medium',
  },
  {
    ticker: 'LIN',
    company: 'Linde',
    core_industry: '에너지/산업소재',
    theme_tags: '산업용 가스, 수소, 제조업, 장기 계약',
    investment_style: '방어주, 경기민감, 혼합',
    role_in_watchlist: '산업용 가스의 반복 수요와 장기 계약 구조가 안정성에 주는 영향 관찰',
    tracking_priority: 'Medium',
  },
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
    description: '최종 결과물: 초안 저장 방식을 고릅니다. 이메일 발송 전에는 HTML 최종본을 따로 만들 수 있습니다.',
    allowed_values: 'google_docs_draft,email_html_draft,markdown',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'weekly_lab_run_day',
    setting_value: 'TUESDAY',
    setting_type: 'select',
    description: 'Weekly Lab 실행 요일: Apps Script 자체 예약이 실행될 요일입니다.',
    allowed_values: 'MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY',
    user_editable: 'TRUE',
  },
  {
    setting_key: 'weekly_lab_run_hour',
    setting_value: '8',
    setting_type: 'number',
    description: 'Weekly Lab 실행 시간: 0~23 사이 숫자입니다. 예: 8은 오전 8시입니다.',
    allowed_values: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23',
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

const WEEKLY_LAB_PRIMARY_SCHEDULE_KEY = 'weekly_lab_primary_schedule';
const WEEKLY_LAB_LEGACY_SCHEDULE_KEY = 'tuesday_weekly_report';

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
    schedule_key: WEEKLY_LAB_PRIMARY_SCHEDULE_KEY,
    description: 'Weekly Lab 정기 초안 생성',
    enabled: 'ON',
    cadence: 'weekly_configured',
    last_run_at: '',
    next_run_hint: '설정값 기준',
  },
  {
    schedule_key: WEEKLY_LAB_LEGACY_SCHEDULE_KEY,
    description: '기존 Weekly Lab 자동 생성 호환 키',
    enabled: 'ON',
    cadence: 'legacy_weekly_configured',
    last_run_at: '',
    next_run_hint: '기존 설정값 기준',
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

const WEEKLY_LAB_READER_TITLES = {
  executive_dashboard: '이번 주 시장 한눈에: 어디에 힘이 실렸나',
  market_map: '시장 지도: QQQ와 SCHD가 말해주는 위험 선호',
  industry_theme_board: '산업과 테마: 본업과 시장 이야기를 나눠 보기',
  stock_dashboard: '종목 관찰: 점수보다 질문을 먼저 보기',
  lens_deep_dive: 'SSMK 렌즈: 대표 종목을 천천히 해부하기',
  hypothesis_lab: '이번 주 관찰 가설 5개',
  forecast_vs_actual: '지난 가설 복기: 맞혔는가보다 무엇을 배웠는가',
  dividend_etf_corner: '배당과 ETF: 높은 배당률은 항상 좋은 신호일까',
  hypothesis_evolution_log: '가설 진화 기록: 질문이 어떻게 좋아졌나',
  learning_notes: '이번 주 레슨: 다음에도 써먹을 질문',
  sources_limitations: '출처와 한계: 무엇을 알고 무엇을 아직 모르는가',
  agent_review_board: '운영 검토: 발행 전 확인할 일',
};

const WEEKLY_LAB_MARKET_ETFS = [
  { ticker: 'SPY', company: 'SPDR S&P 500 ETF Trust', asset_type: 'etf' },
  { ticker: 'QQQ', company: 'Invesco QQQ Trust', asset_type: 'etf' },
  { ticker: 'SCHD', company: 'Schwab U.S. Dividend Equity ETF', asset_type: 'etf' },
  { ticker: 'XLK', company: 'Technology Select Sector SPDR Fund', asset_type: 'etf' },
  { ticker: 'XLE', company: 'Energy Select Sector SPDR Fund', asset_type: 'etf' },
];

const DEFAULT_WEEKLY_LAB_REPORT_BLUEPRINT = [
  {
    section_key: 'executive_dashboard',
    section_order: 1,
    section_title: 'Executive Dashboard',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; market_data; visualization_queue',
    quality_rule: 'must_have_actual_change_and_learning_question',
    beginner_purpose: '이번 주 전체 그림과 핵심 질문을 먼저 잡습니다.',
    notes: '점수는 투자 판단이 아니라 관찰 우선순위입니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.executive_dashboard,
  },
  {
    section_key: 'market_map',
    section_order: 2,
    section_title: 'Market Map',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'market_data',
    quality_rule: 'must_explain_market_direction_without_recommendation',
    beginner_purpose: '개별 종목 전에 시장 바람의 방향을 봅니다.',
    notes: 'SPY, QQQ, SCHD, XLK, XLE가 있으면 우선 사용합니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.market_map,
  },
  {
    section_key: 'industry_theme_board',
    section_order: 3,
    section_title: 'Industry & Theme Board',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; sector_theme_scores; watchlist',
    quality_rule: 'must_separate_industry_theme_style',
    beginner_purpose: '산업, 테마, 투자 성격을 섞지 않고 구분합니다.',
    notes: '산업은 돈 버는 본업, 테마는 시장의 관심 이야기입니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.industry_theme_board,
  },
  {
    section_key: 'stock_dashboard',
    section_order: 4,
    section_title: 'SSMK Stock Dashboard',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; market_data',
    quality_rule: 'must_show_score_as_question_selector',
    beginner_purpose: '총점보다 왜 이번 주에 볼 만한지 확인합니다.',
    notes: 'Top N은 설정값을 사용합니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.stock_dashboard,
  },
  {
    section_key: 'lens_deep_dive',
    section_order: 5,
    section_title: 'SSMK Lens Deep Dive',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; watchlist; company_fundamentals; shareholder_returns',
    quality_rule: 'must_include_missing_data_when_facts_absent',
    beginner_purpose: '종목 하나를 SSMK 렌즈로 천천히 해부합니다.',
    notes: '데이터가 부족하면 부족하다고 씁니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.lens_deep_dive,
  },
  {
    section_key: 'hypothesis_lab',
    section_order: 6,
    section_title: 'Hypothesis Lab',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'hypothesis_lab; weekly_scores; news_events',
    quality_rule: 'must_have_hypothesis_evidence_lesson_limit',
    beginner_purpose: '이번 주 핵심 가설을 다음 확인 질문으로 바꿉니다.',
    notes: '가설은 정답이 아니라 복기할 질문입니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.hypothesis_lab,
  },
  {
    section_key: 'forecast_vs_actual',
    section_order: 7,
    section_title: 'Forecast vs Actual',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'hypothesis_reviews; weekly_scores',
    quality_rule: 'must_show_review_status_or_missing_review',
    beginner_purpose: '지난 가설이 실제 흐름과 어떻게 달랐는지 봅니다.',
    notes: '복기할 데이터가 없으면 아직 복기 전이라고 씁니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.forecast_vs_actual,
  },
  {
    section_key: 'dividend_etf_corner',
    section_order: 8,
    section_title: 'Dividend & ETF Corner',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'shareholder_returns; etf_watch; weekly_scores',
    quality_rule: 'must_explain_dividend_etf_as_learning_not_recommendation',
    beginner_purpose: '배당과 ETF를 수익률 숫자만으로 보지 않는 연습을 합니다.',
    notes: '데이터가 부족하면 배당/ETF 보강 필요를 남깁니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.dividend_etf_corner,
  },
  {
    section_key: 'hypothesis_evolution_log',
    section_order: 9,
    section_title: 'Hypothesis Evolution Log',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'FALSE',
    data_sources: 'hypothesis_evolution_log; report_versions',
    quality_rule: 'must_track_change_or_state_missing',
    beginner_purpose: '가설이 시간이 지나며 어떻게 바뀌었는지 기록합니다.',
    notes: '편집자용 흐름이라 이메일에서는 기본 제외합니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.hypothesis_evolution_log,
  },
  {
    section_key: 'learning_notes',
    section_order: 10,
    section_title: 'Learning Notes',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'weekly_scores; qa_review_log',
    quality_rule: 'must_end_with_beginner_lesson',
    beginner_purpose: '이번 주에 배운 개념을 쉬운 말로 정리합니다.',
    notes: '일반론만 쓰지 않고 이번 주 데이터와 연결합니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.learning_notes,
  },
  {
    section_key: 'sources_limitations',
    section_order: 11,
    section_title: 'Sources & Limitations',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'TRUE',
    data_sources: 'data_sources; source_policy; weekly_scores',
    quality_rule: 'must_name_missing_data',
    beginner_purpose: '무엇을 알고 무엇을 아직 모르는지 구분합니다.',
    notes: '부족한 데이터는 실패가 아니라 다음 확인 질문입니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.sources_limitations,
  },
  {
    section_key: 'agent_review_board',
    section_order: 12,
    section_title: 'Agent Review Board',
    required: 'TRUE',
    enabled: 'TRUE',
    docs_output: 'TRUE',
    email_output: 'FALSE',
    data_sources: 'agent_review_log; qa_review_log',
    quality_rule: 'must_keep_operations_out_of_email',
    beginner_purpose: '운영자가 초안 품질과 차단 이슈를 확인합니다.',
    notes: '운영용 섹션이라 이메일에서는 기본 제외합니다.',
    visible_title_ko: WEEKLY_LAB_READER_TITLES.agent_review_board,
  },
];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SSMK 자동화')
    .addItem('설정 열기: SSMK Control Center', 'showSettingsSidebar')
    .addSeparator()
    .addItem('0. Weekly Lab 초안 준비 전체 실행', 'runWeeklyLabWorkflow')
    .addItem('0-1. 오늘 전체 사이클 실행(이어가기)', 'forceRunWeeklyLabFullCycleForToday')
    .addItem('0-2. 오늘 전체 사이클 처음부터 다시 실행', 'forceRestartWeeklyLabFullCycleForToday')
    .addItem('0-legacy. 이전 주간 초안 준비 실행', 'runWeeklyDraftPrepWorkflow')
    .addSeparator()
    .addItem('1. 시트 구조 점검/보정(빠른)', 'setupSsmkWorkbook')
    .addItem('1-0. setup build 확인', 'showSsmkSetupBuild')
    .addItem('1-1. weekly_scores 수식 보강', 'applyWeeklyScoreFormulas')
    .addItem('1-2. 입력용 드롭다운 보강(선택)', 'applySsmkWorkbookDropdowns')
    .addItem('1-3. 추천화 표현 자동 순화', 'autoSoftenWeeklyScoreLanguage')
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

function getWatchlistClassificationGuide() {
  return WATCHLIST_CLASSIFICATION_GUIDE.map((row) => Object.assign({}, row));
}

function runWeeklyLabWorkflow(issueDate) {
  const runId = startAutomationRun_('weekly_lab', getWeeklyLabScheduleKey_(), 'manual_or_schedule');
  let promptResult = null;
  let reportStatus = '사용자 확인 필요';
  let qaReview = null;

  try {
    const targetIssueDate = issueDate || getLatestIssueDate_() || today_();

    prepareSsmkWorkbook_();
    logAutomationStep_(runId, 1, 'prepare_workbook', '오퍼레이터', 'success', '시트 구조 점검', '탭/헤더/수식 점검 완료(드롭다운은 선택 보강)', '', 0);

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
      finishAutomationRun_(runId, workflowStatus, promptResult.reportId, promptResult.url, '', '이메일 발송 없음. Weekly Lab 초안 준비와 QA 리뷰까지 완료함.');
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

  prepareSsmkWorkbook_({ includeDropdowns: false, includeFormulas: true, logProgress: false });
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

  notifySsmk_(
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
    ].join('\n'),
    'SSMK Weekly Draft'
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
  const result = prepareSsmkWorkbook_({
    includeDropdowns: false,
    includeFormulas: false,
    logProgress: true,
  });
  notifySsmk_(`SSMK 시트 구조 점검이 끝났습니다. build=${SSMK_SETUP_BUILD}. 실행 시간을 줄이기 위해 이번 실행에서는 수식/드롭다운 보강을 생략했습니다.`, 'SSMK Setup');
  return result;
}

function showSsmkSetupBuild() {
  notifySsmk_(`현재 setup build는 ${SSMK_SETUP_BUILD} 입니다.`, 'SSMK Setup Build');
  return SSMK_SETUP_BUILD;
}

function applyWeeklyScoreFormulas() {
  const ss = SpreadsheetApp.getActive();
  applyWeeklyScoreFormulas_(ss);
  notifySsmk_('weekly_scores 수식 보강이 끝났습니다.', 'SSMK Formulas');
}

function applySsmkWorkbookDropdowns() {
  const ss = SpreadsheetApp.getActive();
  applyDropdowns_(ss);
  notifySsmk_('SSMK 입력용 드롭다운 보강이 끝났습니다.', 'SSMK Dropdowns');
}

function prepareSsmkWorkbook_(options) {
  const normalizedOptions = normalizeWorkbookPrepareOptions_(options);
  const ss = SpreadsheetApp.getActive();

  logSetupProgress_('prepare start', normalizedOptions.logProgress);
  ensureControlCenterSheets_(ss);
  logSetupProgress_('control center ready', normalizedOptions.logProgress);
  ensureWorkbookSchemaSheets_(ss, normalizedOptions.logProgress);
  logSetupProgress_('schema sheets ready', normalizedOptions.logProgress);
  seedDefaultReportBlueprint_(ss);
  logSetupProgress_('report blueprint ready', normalizedOptions.logProgress);

  normalizeWatchlistColumns_(ss);
  logSetupProgress_('watchlist normalized', normalizedOptions.logProgress);
  setHeaders_(ss, SSMK.sheets.weeklyScores, SSMK.headers.weeklyScores);
  setHeaders_(ss, SSMK.sheets.scoreHistory, SSMK.headers.weeklyScores);
  logSetupProgress_('score headers ready', normalizedOptions.logProgress);
  if (normalizedOptions.includeFormulas) {
    applyWeeklyScoreFormulas_(ss);
    logSetupProgress_('weekly score formulas ready', normalizedOptions.logProgress);
  }
  if (normalizedOptions.includeDropdowns) {
    applyDropdowns_(ss);
    logSetupProgress_('dropdowns ready', normalizedOptions.logProgress);
  }
  return {
    ok: true,
    issue_date: today_(),
    include_dropdowns: normalizedOptions.includeDropdowns,
    include_formulas: normalizedOptions.includeFormulas,
    build: SSMK_SETUP_BUILD,
  };
}

function normalizeWorkbookPrepareOptions_(options) {
  return {
    includeDropdowns: Boolean(options && options.includeDropdowns),
    includeFormulas: options && Object.prototype.hasOwnProperty.call(options, 'includeFormulas')
      ? Boolean(options.includeFormulas)
      : true,
    logProgress: Boolean(options && options.logProgress),
  };
}

function ensureWorkbookSchemaSheets_(ss, logProgress) {
  WORKBOOK_SCHEMA_SHEET_GROUPS.forEach((group, index) => {
    group.forEach((key) => {
      setHeaders_(ss, SSMK.sheets[key], SSMK.headers[key]);
    });
    SpreadsheetApp.flush();
    logSetupProgress_(`schema group ${index + 1}/${WORKBOOK_SCHEMA_SHEET_GROUPS.length} ready`, logProgress);
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

function seedDefaultReportBlueprint_(ss) {
  const existing = new Set(readObjects_(SSMK.sheets.reportBlueprint).map((row) => row.section_key));
  DEFAULT_WEEKLY_LAB_REPORT_BLUEPRINT.forEach((section) => {
    if (!existing.has(section.section_key)) {
      appendObject_(SSMK.sheets.reportBlueprint, SSMK.headers.reportBlueprint, section);
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
    operation_home: getOperationHomeState_(),
    trigger_state: getWeeklyLabTriggerState_(),
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

function getOperationHomeState_() {
  const reportRuns = readObjects_(SSMK.sheets.reportRuns);
  const automationRuns = readObjects_(SSMK.sheets.automationRunLog);
  const automationSteps = readObjects_(SSMK.sheets.automationStepLog);
  const errorRows = readObjects_(SSMK.sheets.errorLog);
  const visualizationRows = readObjects_(SSMK.sheets.visualizationQueue);
  const qaRows = readObjects_(SSMK.sheets.qaReviewLog);
  const reportVersions = readObjects_(SSMK.sheets.reportVersions);
  const latestRun = latestRowByText_(automationRuns, 'started_at');
  const latestRunId = latestRun ? String(latestRun.run_id || '').trim() : '';
  const latestSteps = latestRunId ? automationSteps.filter((row) => String(row.run_id || '').trim() === latestRunId) : [];
  const latestStep = getLatestStepByOrder_(latestSteps);
  const inferredReport = inferReportForRun_(latestRun, latestSteps, reportRuns);
  const latestReportId = inferredReport ? String(inferredReport.report_id || '').trim() : '';
  const latestQa = latestRunId
    ? latestRowByText_(qaRows.filter((row) => String(row.run_id || '').trim() === latestRunId), 'review_date')
    : null;
  const latestErrors = latestRunId ? errorRows.filter((row) => String(row.run_id || '').trim() === latestRunId) : [];
  const latestVisualizations = latestReportId ? visualizationRows.filter((row) => String(row.report_id || '').trim() === latestReportId) : [];
  const latestVersions = latestReportId ? reportVersions.filter((row) => String(row.report_id || '').trim() === latestReportId) : [];
  const warningStepCount = latestSteps.filter((row) => normalizeWorkflowStatus_(row.status) === 'warning').length;
  const failedStepCount = latestSteps.filter((row) => {
    const status = normalizeWorkflowStatus_(row.status);
    return status === 'failed' || status === 'blocked';
  }).length;
  const totalStepCount = weeklyLabFullCycleSteps_().length;
  const completedStepCount = latestSteps.length;
  const runElapsedSec = latestRun && latestRun.started_at ? calculateDurationSeconds_(latestRun.started_at, nowText_()) : '';
  const remainingSteps = summarizeRemainingWeeklyLabSteps_(latestSteps);
  const hasEmailHtmlDraft = latestVersions.some((row) => /drive\.google\.com\/file/.test(String(row.output_url || '')));
  const operationVerdict = deriveOperationHomeVerdict_({
    run_status: latestRun ? latestRun.status : '',
    qa_status: latestQa ? latestQa.overall_status : '',
    error_count: latestErrors.length,
    failed_step_count: failedStepCount,
    warning_step_count: warningStepCount,
    elapsed_sec: runElapsedSec,
    completed_step_count: completedStepCount,
    total_step_count: totalStepCount,
    has_email_html_draft: hasEmailHtmlDraft,
  });

  return {
    operation_verdict: operationVerdict,
    latest_report_id: inferredReport ? inferredReport.report_id || '' : '',
    latest_issue_date: inferredReport ? inferredReport.issue_date || '' : '',
    latest_report_status: inferredReport ? inferredReport.generation_status || '' : '',
    latest_report_url: inferredReport ? inferredReport.report_file_path || '' : '',
    latest_run_id: latestRun ? latestRun.run_id || '' : '',
    latest_run_status: latestRun ? latestRun.status || '' : '',
    latest_run_started_at: latestRun ? latestRun.started_at || '' : '',
    latest_run_elapsed_min: runElapsedSec === '' ? '' : Math.max(0, Math.round(Number(runElapsedSec) / 60)),
    latest_current_step: latestStep ? `${latestStep.step_order}. ${plainStepName_(latestStep.step_name)}` : '',
    latest_remaining_steps: remainingSteps,
    latest_progress_label: latestRun ? `${Math.min(completedStepCount, totalStepCount)}/${totalStepCount}단계` : '',
    latest_step_count: latestSteps.length,
    latest_warning_step_count: warningStepCount,
    latest_failed_step_count: failedStepCount,
    latest_error_count: latestErrors.length,
    latest_visualization_count: latestVisualizations.length,
    latest_qa_status: latestQa ? latestQa.overall_status || '' : '',
    latest_qa_action: latestQa ? latestQa.recommended_next_action || '' : '',
  };
}

function weeklyLabFullCycleSteps_() {
  return [
    ['reset_issue_date_rows', '오늘 작업 행 정리'],
    ['prepare_workbook', '시트 구조 점검'],
    ['collect_weekly_back_data', '시장 데이터 수집'],
    ['collect_news_events', '뉴스 후보 수집'],
    ['build_weekly_scores', '주간 점수 생성'],
    ['soften_learning_language', '표현 순화'],
    ['create_weekly_lab_draft_report', 'Google Docs 보고서 초안'],
    ['create_visualization_queue', '자동 시각화 생성'],
    ['schedule_hypothesis_reviews', '가설 복기 예약'],
    ['run_agent_review_board', '에이전트 검토'],
    ['create_email_html_final_draft', '이메일 HTML 초안'],
    ['create_operator_qa_review', '최종 QA 리뷰'],
  ];
}

function getLatestStepByOrder_(steps) {
  if (!steps || steps.length === 0) return null;
  return steps.slice().sort((a, b) => Number(a.step_order || 0) - Number(b.step_order || 0)).pop() || null;
}

function summarizeRemainingWeeklyLabSteps_(steps) {
  const done = new Set((steps || []).map((row) => String(row.step_name || '').trim()));
  return weeklyLabFullCycleSteps_()
    .filter((item) => !done.has(item[0]))
    .map((item) => item[1])
    .slice(0, 3)
    .join(', ');
}

function plainStepName_(stepName) {
  const found = weeklyLabFullCycleSteps_().find((item) => item[0] === String(stepName || '').trim());
  return found ? found[1] : String(stepName || '').trim();
}

function inferReportForRun_(run, steps, reportRuns) {
  if (!run) return latestRowByText_(reportRuns, 'generated_at');
  const runReportId = String(run.report_id || '').trim();
  if (runReportId) {
    const exact = reportRuns.find((row) => String(row.report_id || '').trim() === runReportId);
    if (exact) return exact;
  }

  const reportStep = (steps || []).slice().reverse().find((row) => /report_id:\s*RPT-/.test(String(row.input_summary || '')));
  const match = reportStep ? String(reportStep.input_summary || '').match(/report_id:\s*(RPT-[0-9-]+)/) : null;
  if (match) {
    const fromStep = reportRuns.find((row) => String(row.report_id || '').trim() === match[1]);
    if (fromStep) return fromStep;
  }

  const startedAt = String(run.started_at || '');
  const afterStart = reportRuns.filter((row) => String(row.generated_at || '') >= startedAt);
  return latestRowByText_(afterStart.length ? afterStart : reportRuns, 'generated_at');
}

function deriveOperationHomeVerdict_(state) {
  const normalizedRun = normalizeWorkflowStatus_(state.run_status);
  const normalizedQa = normalizeWorkflowStatus_(state.qa_status);
  if (!state.run_status) return '아직 실행 기록 없음';
  if (normalizedRun === 'running') {
    if (Number(state.elapsed_sec || 0) >= 540) return state.has_email_html_draft ? '마감 확인 필요' : '진행 멈춤 가능';
    return `진행 중 ${Math.min(Number(state.completed_step_count || 0), Number(state.total_step_count || 0))}/${state.total_step_count || '?'}단계`;
  }
  if (normalizedRun === 'failed' || normalizedQa === 'failed' || normalizedQa === 'blocked' || state.error_count > 0 || state.failed_step_count > 0) {
    return '확인 필요';
  }
  if (normalizedRun === 'warning' || normalizedQa === 'warning' || state.warning_step_count > 0) {
    return '경고 확인';
  }
  if (normalizedRun === 'success') return '완료';
  return '진행 상태 확인';
}

function getWeeklyLabTriggerState_() {
  const config = getWeeklyLabScheduleConfig_();
  return {
    schedule_enabled: config.enabled,
    run_day: config.runDay,
    run_hour: config.runHour,
    trigger_count: countWeeklyLabTriggers_(),
    next_run_hint: `${localizeWeekDay_(config.runDay)} ${config.runHour}:00 전후`,
    primary_engine: 'Apps Script 자체 트리거',
    codex_role: '실행 후 점검/요약/보조',
  };
}

function recoverLatestWeeklyLabRunStatus() {
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);

  const runs = readObjects_(SSMK.sheets.automationRunLog)
    .filter((row) => String(row.run_type || '') === 'weekly_lab_full_cycle')
    .filter((row) => normalizeWorkflowStatus_(row.status) === 'running')
    .sort((a, b) => String(a.started_at || '').localeCompare(String(b.started_at || '')));
  const run = runs.pop();
  if (!run) {
    return {
      ok: true,
      message: 'running 상태의 Weekly Lab 실행이 없습니다.',
      state: getControlCenterState(),
    };
  }

  const runId = String(run.run_id || '').trim();
  const steps = readObjects_(SSMK.sheets.automationStepLog)
    .filter((row) => String(row.run_id || '').trim() === runId);
  const report = inferReportForRun_(run, steps, readObjects_(SSMK.sheets.reportRuns));
  const reportId = report ? String(report.report_id || '').trim() : '';
  const versions = reportId
    ? readObjects_(SSMK.sheets.reportVersions).filter((row) => String(row.report_id || '').trim() === reportId)
    : [];
  const latestVersion = latestRowByText_(versions, 'created_at');
  const htmlVersion = versions.find((row) => /drive\.google\.com\/file/.test(String(row.output_url || '')));
  const finalOutputUrl = htmlVersion ? htmlVersion.output_url : (latestVersion ? latestVersion.output_url : (report ? report.report_file_path : ''));

  if (!reportId) {
    return {
      ok: false,
      message: `마감할 report_id를 찾지 못했습니다. run_id=${runId}`,
      state: getControlCenterState(),
    };
  }

  const warningStepCount = steps.filter((row) => normalizeWorkflowStatus_(row.status) === 'warning').length;
  const finalStatus = warningStepCount > 0 ? 'warning' : 'success';
  finishAutomationRun_(runId, finalStatus, reportId, finalOutputUrl, '', '상태 복구: 산출물 확인 후 실행을 마감했습니다. 이메일 발송 없음.');

  let qaMessage = '';
  const existingQa = readObjects_(SSMK.sheets.qaReviewLog)
    .find((row) => String(row.run_id || '').trim() === runId);
  if (!existingQa) {
    try {
      const qaReview = createOperatorQaReview_(runId, reportId);
      logAutomationStep_(runId, 12, 'create_operator_qa_review', '오퍼레이터', 'success', `report_id: ${reportId}`, `qa_id: ${qaReview.qa_id}`, '', 0);
      qaMessage = ` QA 리뷰도 생성했습니다: ${qaReview.qa_id}`;
    } catch (error) {
      logError_(runId, 'recoverLatestWeeklyLabRunStatus', 'medium', 'qa_recovery_error', error.message, '마감 복구 중 QA 생성 실패', 'qa_review_log를 확인하고 필요하면 다시 복구 실행');
      qaMessage = ` QA 리뷰 생성은 실패했습니다: ${error.message}`;
    }
  }

  return {
    ok: true,
    run_id: runId,
    report_id: reportId,
    status: finalStatus,
    final_output_url: finalOutputUrl,
    message: `최신 running 실행을 ${finalStatus} 상태로 마감했습니다.${qaMessage}`,
    state: getControlCenterState(),
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
      ? '일부 스케줄 정책은 저장했지만, 몇 가지 항목은 형식이 맞지 않아 그대로 두었습니다. Codex 예약 자동화 자체는 Control Center에서 자동 변경되지 않습니다.'
      : '자동화 스케줄 정책을 저장했습니다. Codex 예약 자동화 자체는 Control Center에서 자동 변경되지 않습니다.',
    warnings: warnings,
    updated_keys: updatedKeys,
    state: getControlCenterState(),
  };
}

function syncWeeklyLabTriggerFromControlCenter() {
  const ss = SpreadsheetApp.getActive();
  ensureControlCenterSheets_(ss);
  const config = getWeeklyLabScheduleConfig_();

  deleteWeeklyLabTriggers_();

  if (config.enabled !== 'ON') {
    updateWeeklyLabScheduleMetadata_({
      last_run_at: '',
      next_run_hint: 'OFF: Apps Script 예약 없음',
    });
    return {
      ok: true,
      status: 'disabled',
      message: 'Weekly Lab 스케줄 정책이 OFF라서 Apps Script 예약을 만들지 않았습니다.',
      trigger_count: 0,
      state: getControlCenterState(),
    };
  }

  ScriptApp.newTrigger('scheduledWeeklyLabTrigger')
    .timeBased()
    .onWeekDay(toScriptWeekDay_(config.runDay))
    .atHour(config.runHour)
    .create();

  const hint = `${localizeWeekDay_(config.runDay)} ${config.runHour}:00 전후`;
  updateWeeklyLabScheduleMetadata_({
    next_run_hint: hint,
  });

  return {
    ok: true,
    status: 'ok',
    message: `Apps Script 자체 예약을 적용했습니다. 다음 기준: ${hint}`,
    trigger_count: countWeeklyLabTriggers_(),
    state: getControlCenterState(),
  };
}

function removeWeeklyLabTimeTriggers() {
  const removedCount = deleteWeeklyLabTriggers_();
  updateWeeklyLabScheduleMetadata_({
    next_run_hint: '예약 제거됨',
  });
  return {
    ok: true,
    status: 'ok',
    message: `Weekly Lab Apps Script 예약 ${removedCount}개를 제거했습니다.`,
    trigger_count: countWeeklyLabTriggers_(),
    state: getControlCenterState(),
  };
}

function scheduledWeeklyLabTrigger() {
  const config = getWeeklyLabScheduleConfig_();
  const issueDate = today_();

  if (config.enabled !== 'ON') {
    const runId = startAutomationRun_('weekly_lab', config.scheduleKey, 'apps_script_trigger');
    finishAutomationRun_(runId, 'skipped', '', '', '', '스케줄 정책이 OFF라서 실행하지 않았습니다.');
    return { ok: true, status: 'skipped', reason: 'schedule_off', issue_date: issueDate };
  }

  const result = runWeeklyLabFullCycle(issueDate, { triggerSource: 'apps_script_trigger', mode: 'resume' });
  updateWeeklyLabScheduleMetadata_({ last_run_at: nowText_() });
  return result;
}

function forceRunWeeklyLabFullCycleForToday() {
  return runWeeklyLabFullCycle(today_(), { triggerSource: 'manual_force', mode: 'resume' });
}

function forceRestartWeeklyLabFullCycleForToday() {
  return runWeeklyLabFullCycle(today_(), { triggerSource: 'manual_force', mode: 'restart' });
}

function continueWeeklyLabFullCycleForToday() {
  return continueWeeklyLabFullCycle(today_(), { triggerSource: 'manual_continue' });
}

function rebuildAndContinueWeeklyLabFullCycleFor20260512() {
  const targetIssueDate = '2026-05-12';
  const runId = startAutomationRun_('weekly_lab_manual_rebuild_continue', getWeeklyLabScheduleKey_(), 'manual_apps_script_ui');
  Logger.log(`[SSMK 2026-05-12 rebuild] start run_id=${runId}`);

  try {
    const report = findLatestWeeklyLabReportForIssueDate_(targetIssueDate);
    if (!report) {
      throw new Error(`${targetIssueDate} 기준 report_runs 행을 찾지 못했습니다.`);
    }
    const rebuilt = rebuildWeeklyLabDraftForExistingReport_(report, runId);
    logAutomationStep_(runId, 1, 'rebuild_weekly_lab_draft_sections', '세이지', 'success', `report_id: ${rebuilt.report_id}`, rebuilt.doc_url, `quality=${rebuilt.quality_status}`, 0);

    const emailDraftResult = createEmailFinalReportDraft(rebuilt.report_id);
    logAutomationStep_(runId, 2, 'create_email_html_final_draft', '오퍼레이터', 'success', `report_id: ${rebuilt.report_id}`, emailDraftResult.html_url, '5/12 개선 초안 기반 HTML 생성. 이메일 발송 없음.', 0);

    let finalStatus = rebuilt.quality_status === 'blocked' ? 'warning' : 'success';
    let qaReview = null;
    try {
      qaReview = createOperatorQaReview_(runId, rebuilt.report_id);
      logAutomationStep_(runId, 3, 'create_operator_qa_review', '오퍼레이터', 'success', `report_id: ${rebuilt.report_id}`, `qa_id: ${qaReview.qa_id}`, '', 0);
    } catch (qaError) {
      finalStatus = 'warning';
      logError_(runId, 'createOperatorQaReview_', 'medium', 'qa_review_error', qaError.message, '5/12 개선 이어가기 중 QA 로그 생성 예외', 'qa_review_log 확인');
    }

    finishAutomationRun_(runId, finalStatus, rebuilt.report_id, emailDraftResult.html_url, '', `5/12 개선 초안 재생성 및 HTML/Pub QC 생성 완료. 이메일 발송 없음. docs=${rebuilt.doc_url}`);
    Logger.log(`[SSMK 2026-05-12 rebuild] finished status=${finalStatus} report_id=${rebuilt.report_id}`);
    return {
      ok: true,
      status: finalStatus,
      run_id: runId,
      issue_date: targetIssueDate,
      report_id: rebuilt.report_id,
      rebuilt_doc_url: rebuilt.doc_url,
      email_html_url: emailDraftResult.html_url,
      qa_review_id: qaReview ? qaReview.qa_id : '',
      message: '5/12 개선 초안과 이메일 HTML 최종본을 만들었습니다. 이메일은 발송하지 않았습니다.',
    };
  } catch (error) {
    Logger.log(`[SSMK 2026-05-12 rebuild] failed run_id=${runId} error=${error.message}`);
    logError_(runId, 'rebuildAndContinueWeeklyLabFullCycleFor20260512', 'high', 'manual_rebuild_continue_error', error.message, '5/12 개선 초안/HTML 이어가기 중 예외', 'error_log 확인 후 재실행');
    finishAutomationRun_(runId, 'failed', '', '', error.message, '5/12 개선 이어가기 실패. 이메일 발송 없음.');
    throw error;
  }
}

function continueWeeklyLabFullCycle(issueDate, options) {
  const targetIssueDate = issueDate || today_();
  const triggerSource = String(options && options.triggerSource ? options.triggerSource : 'manual_continue').trim();
  const runId = startAutomationRun_('weekly_lab_full_cycle_continue', getWeeklyLabScheduleKey_(), triggerSource);
  Logger.log(`[SSMK continue] start issue_date=${targetIssueDate} run_id=${runId}`);

  try {
    const report = findLatestWeeklyLabReportForIssueDate_(targetIssueDate);
    if (!report) {
      throw new Error(`${targetIssueDate} 기준 이어서 만들 report_runs 행을 찾지 못했습니다.`);
    }
    Logger.log(`[SSMK continue] report found report_id=${report.report_id} status=${report.generation_status}`);
    return continueWeeklyLabFullCycleFromReport_(targetIssueDate, runId, report);
  } catch (error) {
    Logger.log(`[SSMK continue] failed issue_date=${targetIssueDate} run_id=${runId} error=${error.message}`);
    logError_(runId, 'continueWeeklyLabFullCycle', 'high', 'continue_error', error.message, '이메일 HTML 최종본 이어가기 중 예외', 'report_runs와 report_sections를 확인 후 재실행');
    finishAutomationRun_(runId, 'failed', '', '', error.message, '이어가기 실패. 이메일 발송 없음.');
    throw error;
  }
}

function continueWeeklyLabFullCycleFromReport_(targetIssueDate, runId, report) {
  const reportId = String(report && report.report_id || '').trim();
  if (!reportId) {
    throw new Error('이어가기 대상 report_id가 비어 있습니다.');
  }

  if (reportHasEmailHtmlDraft_(reportId)) {
    Logger.log(`[SSMK continue] skipped existing email html report_id=${reportId}`);
    finishAutomationRun_(runId, 'skipped', reportId, report.report_file_path || '', '', '이미 이메일용 HTML 최종본이 있어 중복 생성을 건너뜁니다.');
    return {
      ok: true,
      status: 'skipped',
      reason: 'email_html_exists',
      run_id: runId,
      issue_date: targetIssueDate,
      report_id: reportId,
      message: '이미 이메일용 HTML 최종본이 있습니다.',
    };
  }

  Logger.log(`[SSMK continue] creating email html report_id=${reportId}`);
  const emailDraftResult = createEmailFinalReportDraft(reportId);
  Logger.log(`[SSMK continue] email html ready report_id=${reportId} html_url=${emailDraftResult.html_url}`);
  logAutomationStep_(runId, 1, 'create_email_html_final_draft', '오퍼레이터', 'success', `report_id: ${reportId}`, emailDraftResult.html_url, 'timeout 이후 이어가기 실행', 0);

  let finalStatus = 'success';
  let qaReview = null;
  try {
    qaReview = createOperatorQaReview_(runId, reportId);
    Logger.log(`[SSMK continue] qa review ready report_id=${reportId} qa_id=${qaReview.qa_id}`);
    logAutomationStep_(runId, 2, 'create_operator_qa_review', '오퍼레이터', 'success', `report_id: ${reportId}`, `qa_id: ${qaReview.qa_id}`, '', 0);
  } catch (qaError) {
    finalStatus = 'warning';
    Logger.log(`[SSMK continue] qa review warning report_id=${reportId} error=${qaError.message}`);
    logError_(runId, 'createOperatorQaReview_', 'medium', 'qa_review_error', qaError.message, '이어가기 중 QA 로그 생성 예외', 'qa_review_log 확인');
  }

  finishAutomationRun_(runId, finalStatus, reportId, emailDraftResult.html_url, '', '이메일용 HTML 최종본과 Publish QC 이어가기 완료. 이메일 발송 없음.');
  Logger.log(`[SSMK continue] finished status=${finalStatus} report_id=${reportId} html_url=${emailDraftResult.html_url}`);
  return {
    ok: true,
    status: finalStatus,
    run_id: runId,
    issue_date: targetIssueDate,
    report_id: reportId,
    email_html_url: emailDraftResult.html_url,
    qa_review_id: qaReview ? qaReview.qa_id : '',
    message: '이메일용 HTML 최종본을 이어서 만들었습니다. 이메일은 발송하지 않았습니다.',
  };
}

function runWeeklyLabFullCycle(issueDate, options) {
  const targetIssueDate = issueDate || today_();
  const normalizedOptions = normalizeFullCycleOptions_(options);
  const runId = startAutomationRun_('weekly_lab_full_cycle', getWeeklyLabScheduleKey_(), normalizedOptions.triggerSource);
  let reportResult = null;
  let emailDraftResult = null;
  let qaReview = null;
  let visualizationResult = null;

  try {
    if (normalizedOptions.mode === 'restart') {
      resetIssueDateWorkingRows_(targetIssueDate);
      logAutomationStep_(runId, 1, 'reset_issue_date_rows', '오퍼레이터', 'success', `issue_date: ${targetIssueDate}`, '오늘 기준 작업 행을 정리하고 새로 시작', '', 0);
    } else {
      const existingReport = findLatestWeeklyLabReportForIssueDate_(targetIssueDate);
      if (existingReport) {
        if (!reportHasEmailHtmlDraft_(existingReport.report_id)) {
          return continueWeeklyLabFullCycleFromReport_(targetIssueDate, runId, existingReport);
        }
        finishAutomationRun_(runId, 'skipped', existingReport.report_id || '', existingReport.report_file_path || '', '', `issue_date ${targetIssueDate} 리포트와 이메일 HTML 최종본이 이미 있어 중복 실행을 막았습니다. 처음부터 다시 만들려면 restart 함수를 사용하세요.`);
        return { ok: true, status: 'skipped', reason: 'completed_report_exists', issue_date: targetIssueDate, run_id: runId, report_id: existingReport.report_id || '' };
      }
    }

    prepareSsmkWorkbook_({ includeDropdowns: false, includeFormulas: true, logProgress: false });
    logAutomationStep_(runId, 2, 'prepare_workbook', '오퍼레이터', 'success', '시트 구조와 수식 점검', '필수 탭/헤더/weekly_scores 수식 확인', '', 0);

    const dataResult = collectAndStoreWeeklyBackData_(targetIssueDate, runId, normalizedOptions.mode);
    logAutomationStep_(runId, 3, 'collect_weekly_back_data', '벡터', dataResult.warning_count > 0 ? 'warning' : 'success', `watchlist rows: ${dataResult.watchlist_count}`, `market_data rows created: ${dataResult.created_market_rows}, reused: ${dataResult.reused_market_rows}`, dataResult.warning_summary, 0);

    const newsResult = collectAndStoreNewsEvents_(targetIssueDate, runId, normalizedOptions.mode);
    logAutomationStep_(runId, 4, 'collect_news_events', '벡터', newsResult.warning_count > 0 ? 'warning' : 'success', `watchlist targets: ${newsResult.target_count}`, `news_events rows created: ${newsResult.created_news_rows}, reused: ${newsResult.reused_news_rows}`, newsResult.warning_summary, 0);

    const scoreResult = buildWeeklyScoresFromBackData_(targetIssueDate, runId, normalizedOptions.mode);
    logAutomationStep_(runId, 5, 'build_weekly_scores', '루미', scoreResult.created_score_rows > 0 ? 'success' : 'warning', `issue_date: ${targetIssueDate}`, `weekly_scores rows created: ${scoreResult.created_score_rows}, reused: ${scoreResult.reused_score_rows}`, scoreResult.warning_summary, 0);

    const languageResult = autoSoftenWeeklyScoreLanguage(targetIssueDate);
    logAutomationStep_(runId, 6, 'soften_learning_language', '세이지', 'success', `issue_date: ${targetIssueDate}`, `updated_cell_count: ${languageResult.updatedCellCount}`, '', 0);

    reportResult = createWeeklyLabDraftReportDoc_(targetIssueDate, runId);
    const reportQualityStatus = reportResult.qualityResult && reportResult.qualityResult.status === 'blocked'
      ? 'blocked'
      : (reportResult.qualityResult && reportResult.qualityResult.status === 'warning' ? 'warning' : 'success');
    logAutomationStep_(runId, 7, 'create_weekly_lab_draft_report', '루미', reportQualityStatus, `report_id: ${reportResult.reportId}`, reportResult.url, reportResult.qualityResult ? reportResult.qualityResult.summary : '', 0);

    visualizationResult = createVisualizationQueueForReport_(targetIssueDate, reportResult.reportId);
    logAutomationStep_(runId, 8, 'create_visualization_queue', '벡터/루미', visualizationResult.created_visualization_rows > 0 ? 'success' : 'warning', `report_id: ${reportResult.reportId}`, `visualization rows created: ${visualizationResult.created_visualization_rows}`, visualizationResult.warning_summary, 0);

    const scheduledReviewCount = scheduleHypothesisReviews(targetIssueDate);
    logAutomationStep_(runId, 9, 'schedule_hypothesis_reviews', '파일럿', 'success', `issue_date: ${targetIssueDate}`, `scheduled_reviews: ${scheduledReviewCount}`, '', 0);

    const checks = runAgentReviewBoard(targetIssueDate, runId, reportResult.reportId);
    const qualityBlockingCount = reportResult.qualityResult ? reportResult.qualityResult.blocking_count : 0;
    const blockingCount = checks.filter((check) => check.blocking).length + qualityBlockingCount;
    logAutomationStep_(runId, 10, 'run_agent_review_board', '벡터/루미/세이지/파일럿/노바', blockingCount > 0 ? 'warning' : 'success', `issue_date: ${targetIssueDate}`, `blocking_count: ${blockingCount}`, '', 0);

    emailDraftResult = createEmailFinalReportDraft(reportResult.reportId);
    logAutomationStep_(runId, 11, 'create_email_html_final_draft', '오퍼레이터', 'success', `report_id: ${reportResult.reportId}`, emailDraftResult.html_url, '', 0);

    const finalStatus = qualityBlockingCount > 0 ? 'blocked' : (blockingCount > 0 || dataResult.warning_count > 0 ? 'warning' : 'success');
    finishAutomationRun_(runId, finalStatus, reportResult.reportId, emailDraftResult.html_url || reportResult.url, '', '자료 수집, 시트 기록, 스코어링, 보고서 초안, 이메일용 HTML 최종본 생성 완료. 이메일 발송 없음.');

    try {
      qaReview = createOperatorQaReview_(runId, reportResult.reportId);
      logAutomationStep_(runId, 12, 'create_operator_qa_review', '오퍼레이터', 'success', `report_id: ${reportResult.reportId}`, `qa_id: ${qaReview.qa_id}`, '', 0);
      finishAutomationRun_(runId, finalStatus, reportResult.reportId, emailDraftResult.html_url || reportResult.url, '', 'QA 리뷰까지 완료. 이메일 발송 없음.');
    } catch (qaError) {
      logError_(runId, 'createOperatorQaReview_', 'medium', 'qa_review_error', qaError.message, 'QA 로그 생성 중 예외', 'qa_review_log와 workflow 로그 확인');
      finishAutomationRun_(runId, 'warning', reportResult.reportId, emailDraftResult.html_url || reportResult.url, qaError.message, 'QA 리뷰 생성 실패. 이메일 발송 없음.');
    }

    return {
      ok: true,
      status: finalStatus,
      run_id: runId,
      issue_date: targetIssueDate,
      report_id: reportResult.reportId,
      report_url: reportResult.url,
      email_html_url: emailDraftResult.html_url,
      created_market_rows: dataResult.created_market_rows,
      created_news_rows: newsResult.created_news_rows,
      created_score_rows: scoreResult.created_score_rows,
      created_visualization_rows: visualizationResult ? visualizationResult.created_visualization_rows : 0,
      qa_review_id: qaReview ? qaReview.qa_id : '',
    };
  } catch (error) {
    logError_(runId, 'runWeeklyLabFullCycle', 'high', 'workflow_error', error.message, '전체 사이클 실행 중 예외', '로그 확인 후 resume 또는 restart 선택');
    finishAutomationRun_(runId, 'failed', reportResult ? reportResult.reportId : '', emailDraftResult ? emailDraftResult.html_url : (reportResult ? reportResult.url : ''), error.message, '전체 사이클 실패. 기본 재시도는 resume, 완전 재시작은 restart 함수 사용.');
    throw error;
  }
}

function collectAndStoreWeeklyBackData_(issueDate, runId, mode) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SSMK.sheets.marketData);
  const targetIssueDate = issueDate || today_();
  const watchlistRows = getActiveWatchlistRows_();
  const targetRows = marketDataCollectionTargets_(watchlistRows);
  const existingKeys = new Set(readObjects_(SSMK.sheets.marketData)
    .filter((row) => sameDateText_(row.market_date, targetIssueDate))
    .map((row) => `${String(row.market_date).slice(0, 10)}|${String(row.symbol || '').trim().toUpperCase()}`));
  let createdCount = 0;
  let reusedCount = 0;
  const warnings = [];

  targetRows.forEach((item) => {
    const symbol = String(item.ticker || '').trim().toUpperCase();
    if (!symbol) return;
    const key = `${targetIssueDate}|${symbol}`;
    if (existingKeys.has(key) && mode !== 'restart') {
      reusedCount += 1;
      return;
    }

    const nextRow = sheet.getLastRow() + 1;
    const symbolFormula = googleFinanceSymbolFormula_(symbol);
    const row = [
      targetIssueDate,
      symbol,
      item.company || symbol,
      item.asset_type || 'equity',
      `=IFERROR(GOOGLEFINANCE("${symbolFormula}","price"),"")`,
      `=IFERROR((E${nextRow}/INDEX(GOOGLEFINANCE("${symbolFormula}","price",TODAY()-10,TODAY()),2,2)-1)*100,"")`,
      `=IFERROR((E${nextRow}/INDEX(GOOGLEFINANCE("${symbolFormula}","price",TODAY()-35,TODAY()),2,2)-1)*100,"")`,
      `=IFERROR(GOOGLEFINANCE("${symbolFormula}","volume"),"")`,
      isHardToAutomateTicker_(symbol) ? '낮음' : '중간',
      'GoogleFinance',
      `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}`,
      nowText_(),
      `run_id=${runId}. GOOGLEFINANCE 수식 기반 1차 자동 수집. 뉴스/공시는 다음 단계에서 보강 필요.`,
    ];
    sheet.getRange(nextRow, 1, 1, SSMK.headers.marketData.length).setValues([row]);
    existingKeys.add(key);
    createdCount += 1;
    if (isHardToAutomateTicker_(symbol)) {
      warnings.push(`${symbol}은 ADR/OTC 또는 데이터 공백 가능성이 있어 수동 확인 필요`);
    }
  });

  return {
    watchlist_count: watchlistRows.length,
    market_target_count: targetRows.length,
    core_etf_count: WEEKLY_LAB_MARKET_ETFS.length,
    created_market_rows: createdCount,
    reused_market_rows: reusedCount,
    warning_count: warnings.length,
    warning_summary: warnings.join(' / '),
  };
}

function marketDataCollectionTargets_(watchlistRows) {
  const bySymbol = {};
  (watchlistRows || []).forEach((item) => {
    const symbol = String(item.ticker || '').trim().toUpperCase();
    if (!symbol) return;
    bySymbol[symbol] = Object.assign({ asset_type: 'equity' }, item, { ticker: symbol });
  });
  WEEKLY_LAB_MARKET_ETFS.forEach((item) => {
    const symbol = String(item.ticker || '').trim().toUpperCase();
    if (!symbol) return;
    if (bySymbol[symbol]) {
      bySymbol[symbol] = Object.assign({}, bySymbol[symbol], item, { ticker: symbol });
      return;
    }
    bySymbol[symbol] = Object.assign({}, item, { ticker: symbol });
  });
  return Object.keys(bySymbol).sort().map((symbol) => bySymbol[symbol]);
}

function collectAndStoreNewsEvents_(issueDate, runId, mode) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SSMK.sheets.newsEvents);
  const targetIssueDate = issueDate || today_();
  const targetRows = getActiveWatchlistRows_()
    .filter((row) => String(row.tracking_priority || '').trim().toLowerCase() === 'high')
    .slice(0, 8);
  const existingKeys = new Set(readObjects_(SSMK.sheets.newsEvents)
    .filter((row) => sameDateText_(row.date, targetIssueDate))
    .map((row) => `${String(row.date).slice(0, 10)}|${String(row.ticker_or_industry || '').trim().toUpperCase()}|${String(row.headline || '').trim()}`));
  let createdCount = 0;
  let reusedCount = 0;
  const warnings = [];

  targetRows.forEach((item) => {
    const symbol = String(item.ticker || '').trim().toUpperCase();
    const query = `${item.company || symbol} ${symbol} stock earnings`;
    try {
      const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
      const response = UrlFetchApp.fetch(feedUrl, { muteHttpExceptions: true });
      if (response.getResponseCode() >= 400) {
        warnings.push(`${symbol} 뉴스 RSS 응답 오류 ${response.getResponseCode()}`);
        return;
      }
      const items = parseGoogleNewsRssItems_(response.getContentText()).slice(0, 2);
      if (items.length === 0) {
        warnings.push(`${symbol} 뉴스 후보 없음`);
        return;
      }
      items.forEach((newsItem) => {
        const key = `${targetIssueDate}|${symbol}|${newsItem.title}`;
        if (existingKeys.has(key) && mode !== 'restart') {
          reusedCount += 1;
          return;
        }
        sheet.appendRow([
          targetIssueDate,
          symbol,
          'news_candidate',
          newsItem.title,
          '이번 주 관찰 후보. 실제 영향은 보고서 검토 때 확인 필요',
          'medium',
          newsItem.source || 'Google News RSS',
          newsItem.link,
          'FALSE',
        ]);
        existingKeys.add(key);
        createdCount += 1;
      });
    } catch (error) {
      warnings.push(`${symbol} 뉴스 수집 실패: ${error.message}`);
    }
  });

  return {
    target_count: targetRows.length,
    created_news_rows: createdCount,
    reused_news_rows: reusedCount,
    warning_count: warnings.length,
    warning_summary: warnings.join(' / '),
  };
}

function parseGoogleNewsRssItems_(xmlText) {
  const document = XmlService.parse(xmlText);
  const channel = document.getRootElement().getChild('channel');
  if (!channel) return [];

  return channel.getChildren('item').map((item) => {
    const sourceElement = item.getChild('source');
    return {
      title: item.getChildText('title') || '',
      link: item.getChildText('link') || '',
      source: sourceElement ? sourceElement.getText() : 'Google News RSS',
    };
  }).filter((item) => item.title);
}

function buildStarterHypothesisSummary_(watchlistItem, marketRow) {
  const symbol = String(watchlistItem.ticker || '').trim().toUpperCase();
  const company = watchlistItem.company || symbol;
  const oneWeekChange = formatPercentChange_(marketRow && marketRow.change_pct_1w);
  const fourWeekChange = formatPercentChange_(marketRow && marketRow.change_pct_4w);
  const metricText = watchlistItem.key_metrics_to_watch || '가격 변화, 거래량, 실적 발표, 주요 이벤트';
  const changeText = oneWeekChange || fourWeekChange
    ? `최근 가격 변화는 1주 ${oneWeekChange || '미확인'}, 4주 ${fourWeekChange || '미확인'}입니다.`
    : '이번 자동 수집에서는 아직 가격 변화 수치가 비어 있어 시트 수식 계산 결과를 먼저 대조합니다.';

  return `${company}(${symbol})는 ${changeText} ${metricText}가 같은 방향으로 좋아지면 가격 변화가 실제 사업 기대를 반영했다는 가설을 세울 수 있습니다. 반대로 핵심 지표가 따라오지 않으면 가격만 먼저 움직인 기대 선반영으로 가설을 낮춥니다.`;
}

function buildStarterReasoningExplanation_(watchlistItem, marketRow, totalScore, scoreChange) {
  const roleText = watchlistItem.role_in_watchlist || '관찰 목적이 아직 짧게만 적혀 있습니다';
  const oneWeekChange = formatPercentChange_(marketRow && marketRow.change_pct_1w) || '가격 변화 미확인';
  const scoreText = scoreChange === '' ? `초기 점수 ${roundTo2_(totalScore)}` : `점수 변화 ${formatSignedNumber_(scoreChange)}`;

  return `${roleText}. 1주 가격 변화 ${oneWeekChange}와 ${scoreText}를 함께 보면, 가격이 먼저 움직였는지 아니면 점수의 기초 조건도 같이 움직였는지 나눠 판단할 수 있습니다.`;
}

function buildStarterBeginnerLesson_(watchlistItem, marketRow, scores) {
  const symbol = String(watchlistItem.ticker || '').trim().toUpperCase();
  const isDividend = /배당|dividend/i.test(`${watchlistItem.investment_style || ''} ${watchlistItem.theme_tags || ''} ${watchlistItem.dividend_focus || ''}`);
  const isGrowth = /성장|growth|ai|cloud|클라우드|반도체/i.test(`${watchlistItem.investment_style || ''} ${watchlistItem.theme_tags || ''}`);
  const priceText = formatPercentChange_(marketRow && marketRow.change_pct_1w);

  if (isDividend) {
    return `${symbol || '이 종목'}은 배당 성격이 있으므로 배당률을 결론으로 보지 않습니다. 주가 변화${priceText ? `(${priceText})` : ''}, 현금흐름, 배당 지속성을 나눠야 배당이 기회인지 경고인지 구분할 수 있습니다.`;
  }
  if (isGrowth) {
    return `${symbol || '이 종목'}은 성장 기대가 큰 쪽입니다. 좋은 이야기만으로는 부족하고, 실제 매출과 마진이 같이 좋아질 때 기대가 사업 숫자로 이어진다고 볼 수 있습니다.`;
  }
  if (Number(scores && scores.valuation_timing_score || 0) < 6.3) {
    return `${symbol || '이 종목'}은 가격/타이밍 점수가 낮게 나왔으므로 좋은 회사와 좋은 가격은 다른 질문이라는 점을 배울 수 있습니다.`;
  }
  return `${symbol || '이 종목'}은 점수 하나로 판단하지 않습니다. 가격 변화, 사업 지표, 다음 이벤트가 같은 방향인지 연결해야 이번 움직임의 이유를 배울 수 있습니다.`;
}

function buildWeeklyScoresFromBackData_(issueDate, runId, mode) {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SSMK.sheets.weeklyScores);
  const targetIssueDate = issueDate || today_();
  const weekStart = addDaysText_(targetIssueDate, -6);
  const watchlistRows = getActiveWatchlistRows_();
  const marketBySymbol = new Map(readObjects_(SSMK.sheets.marketData)
    .filter((row) => sameDateText_(row.market_date, targetIssueDate))
    .map((row) => [String(row.symbol || '').trim().toUpperCase(), row]));
  const existingKeys = new Set(readObjects_(SSMK.sheets.weeklyScores)
    .filter((row) => sameDateText_(row.issue_date, targetIssueDate))
    .map((row) => `${String(row.issue_date).slice(0, 10)}|${String(row.ticker || '').trim().toUpperCase()}`));
  const previousScores = latestPreviousScoreByTicker_(targetIssueDate);
  let createdCount = 0;
  let reusedCount = 0;
  const warnings = [];
  const rowsToAppend = [];
  const existingTargetRowCount = countIssueDateRowsInSheet_(sheet, 'issue_date', targetIssueDate);

  watchlistRows.forEach((item) => {
    const symbol = String(item.ticker || '').trim().toUpperCase();
    if (!symbol) return;
    const key = `${targetIssueDate}|${symbol}`;
    if (existingKeys.has(key) && mode !== 'restart') {
      reusedCount += 1;
      return;
    }

    const scores = deriveStarterScoresFromWatchlist_(item);
    const previousScore = previousScores[symbol] || '';
    const totalScore = computeSsmkTotalScore_(scores);
    const scoreChange = previousScore === '' || Number.isNaN(Number(previousScore))
      ? ''
      : roundTo2_(totalScore - Number(previousScore));
    const row = [
      targetIssueDate,
      weekStart,
      symbol,
      item.company || symbol,
      item.core_industry || '',
      item.theme_tags || '',
      item.investment_style || '',
      scores.core_score,
      scores.shareholder_return_score,
      scores.industry_score,
      scores.business_model_score,
      scores.valuation_timing_score,
      scores.insider_event_score,
      totalScore,
      gradeFromScore_(totalScore),
      previousScore,
      scoreChange,
      isHardToAutomateTicker_(symbol) ? '낮음' : '중간',
      scores.uncertainty_level,
      scores.risk_flag,
      buildStarterHypothesisSummary_(item, marketBySymbol.get(symbol)),
      item.key_metrics_to_watch || '가격 변화, 거래량, 실적 발표, 주요 이벤트',
      buildStarterReasoningExplanation_(item, marketBySymbol.get(symbol), totalScore, scoreChange),
      buildStarterBeginnerLesson_(item, marketBySymbol.get(symbol), scores),
      `현재 자동 수집은 가격/거래량 중심 1차 데이터입니다. 뉴스, 공시, 실적 세부값은 추가 확인이 필요합니다.`,
      item.main_events_to_watch || '다음 실적 발표와 주요 뉴스 확인',
      'GoogleFinance; data_sources; 기업 IR/SEC 후보',
      '초안',
    ];
    rowsToAppend.push(row);
    existingKeys.add(key);
    createdCount += 1;
  });

  if (rowsToAppend.length > 0) {
    const startRow = findAppendRowByKeyColumns_(sheet, 3);
    sheet.getRange(startRow, 1, rowsToAppend.length, SSMK.headers.weeklyScores.length).setValues(rowsToAppend);
    SpreadsheetApp.flush();
  }
  applyWeeklyScoreFormulas_(ss);
  SpreadsheetApp.flush();

  const finalTargetRowCount = countIssueDateRowsInSheet_(sheet, 'issue_date', targetIssueDate);
  if (finalTargetRowCount < existingTargetRowCount + createdCount) {
    throw new Error(`weekly_scores 저장 검증 실패: ${targetIssueDate} 행이 ${existingTargetRowCount + createdCount}개 이상이어야 하는데 ${finalTargetRowCount}개만 확인됐습니다.`);
  }

  if (createdCount === 0 && reusedCount === 0) {
    warnings.push('활성 watchlist 행이 없어 weekly_scores를 만들지 못했습니다.');
  }

  return {
    created_score_rows: createdCount,
    reused_score_rows: reusedCount,
    warning_summary: warnings.join(' / '),
  };
}

function computeSsmkTotalScore_(scores) {
  return roundTo2_(
    Number(scores.core_score || 0) * 0.30 +
    Number(scores.shareholder_return_score || 0) * 0.20 +
    Number(scores.industry_score || 0) * 0.20 +
    Number(scores.business_model_score || 0) * 0.15 +
    Number(scores.valuation_timing_score || 0) * 0.10 +
    Number(scores.insider_event_score || 0) * 0.05
  );
}

function gradeFromScore_(score) {
  const numeric = Number(score || 0);
  if (numeric >= 8) return '높음';
  if (numeric >= 6) return '중간';
  return '낮음';
}

function roundTo2_(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function countIssueDateRowsInSheet_(sheet, dateHeader, issueDate) {
  if (!sheet || sheet.getLastRow() < 2) return 0;

  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
  const headers = values[0];
  const dateColumn = headers.indexOf(dateHeader);
  if (dateColumn < 0) return 0;

  return values.slice(1).filter((row) => sameDateText_(row[dateColumn], issueDate)).length;
}

function findAppendRowByKeyColumns_(sheet, keyColumnCount) {
  if (!sheet || sheet.getMaxRows() < 2) return 2;

  const rowCount = sheet.getMaxRows() - 1;
  const columnCount = Math.max(1, Number(keyColumnCount || 1));
  const values = sheet.getRange(2, 1, rowCount, columnCount).getDisplayValues();
  for (let index = values.length - 1; index >= 0; index -= 1) {
    const hasKeyValue = values[index].some((value) => String(value || '').trim() !== '');
    if (hasKeyValue) return index + 3;
  }
  return 2;
}

function toNumberOrBlank_(value) {
  if (value === '' || value === null || typeof value === 'undefined') return '';
  const normalized = String(value).replace(/,/g, '').replace(/%/g, '').trim();
  if (normalized === '') return '';
  const numeric = Number(normalized);
  return Number.isNaN(numeric) ? '' : numeric;
}

function formatSignedNumber_(value) {
  const numeric = toNumberOrBlank_(value);
  if (numeric === '') return '';
  const rounded = roundTo2_(numeric);
  return `${rounded > 0 ? '+' : ''}${rounded}`;
}

function formatPercentChange_(value) {
  const signed = formatSignedNumber_(value);
  return signed === '' ? '' : `${signed}%`;
}

function isFalsyText_(value) {
  const text = String(value === false ? 'FALSE' : value || '').trim().toUpperCase();
  return ['FALSE', 'OFF', 'NO', 'N', '0'].indexOf(text) !== -1;
}

function isTruthyText_(value) {
  const text = String(value === true ? 'TRUE' : value || '').trim().toUpperCase();
  return ['TRUE', 'ON', 'YES', 'Y', '1', '활성'].indexOf(text) !== -1;
}

function truthyUnlessFalse_(value, fallback) {
  if (value === '' || value === null || typeof value === 'undefined') return Boolean(fallback);
  return !isFalsyText_(value);
}

function readWeeklyLabReportBlueprint_() {
  const rows = readObjects_(SSMK.sheets.reportBlueprint);
  const byKey = {};
  rows.forEach((row) => {
    const key = String(row.section_key || '').trim();
    if (key) byKey[key] = row;
  });

  const mergedRows = DEFAULT_WEEKLY_LAB_REPORT_BLUEPRINT.map((defaultSection) => (
    Object.assign({}, defaultSection, byKey[defaultSection.section_key] || {})
  ));
  rows.forEach((row) => {
    const key = String(row.section_key || '').trim();
    const existsInDefault = DEFAULT_WEEKLY_LAB_REPORT_BLUEPRINT.some((section) => section.section_key === key);
    if (key && !existsInDefault) mergedRows.push(row);
  });

  return mergedRows
    .map((row, index) => ({
      section_key: String(row.section_key || `section_${index + 1}`).trim(),
      section_order: Math.max(1, Number(row.section_order || index + 1)),
      section_title: String(row.section_title || row.section_key || `Section ${index + 1}`).trim(),
      required: truthyUnlessFalse_(row.required, false),
      enabled: truthyUnlessFalse_(row.enabled, true),
      docs_output: truthyUnlessFalse_(row.docs_output, true),
      email_output: truthyUnlessFalse_(row.email_output, true),
      data_sources: String(row.data_sources || '').trim(),
      quality_rule: String(row.quality_rule || '').trim(),
      beginner_purpose: String(row.beginner_purpose || '').trim(),
      notes: String(row.notes || '').trim(),
    }))
    .sort((a, b) => a.section_order - b.section_order);
}

function topNFromPreferences_() {
  const numeric = Number(getPreferenceValue_('weekly_lab_top_n', 3));
  if (Number.isNaN(numeric)) return 3;
  return Math.max(1, Math.min(10, Math.round(numeric)));
}

function hypothesisCountFromPreferences_() {
  const numeric = Number(getPreferenceValue_('core_hypothesis_count', 5));
  if (Number.isNaN(numeric)) return 5;
  return Math.max(1, Math.min(7, Math.round(numeric)));
}

function collectWeeklyLabReportContext_(issueDate, reportId, runId) {
  const targetIssueDate = issueDate || getLatestIssueDate_() || today_();
  const marketRows = readObjects_(SSMK.sheets.marketData)
    .filter((row) => sameDateText_(row.market_date, targetIssueDate));
  const marketBySymbol = {};
  marketRows.forEach((row) => {
    const symbol = String(row.symbol || '').trim().toUpperCase();
    if (symbol) marketBySymbol[symbol] = row;
  });

  return {
    issue_date: targetIssueDate,
    week_start: addDaysText_(targetIssueDate, -6),
    generated_at: nowText_(),
    report_id: String(reportId || '').trim(),
    run_id: String(runId || '').trim(),
    top_n: topNFromPreferences_(),
    hypothesis_count: hypothesisCountFromPreferences_(),
    blueprint_sections: readWeeklyLabReportBlueprint_(),
    watchlist: getActiveWatchlistRows_(),
    weekly_scores: readObjects_(SSMK.sheets.weeklyScores)
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate)),
    market_data: marketRows,
    market_by_symbol: marketBySymbol,
    news_events: readObjects_(SSMK.sheets.newsEvents)
      .filter((row) => sameDateText_(row.date, targetIssueDate)),
    sector_theme_scores: readObjects_(SSMK.sheets.sectorThemeScores)
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate)),
    shareholder_returns: readObjects_(SSMK.sheets.shareholderReturns),
    etf_watch: readObjects_(SSMK.sheets.etfWatch),
    company_fundamentals: readObjects_(SSMK.sheets.companyFundamentals),
    revenue_breakdown: readObjects_(SSMK.sheets.revenueBreakdown),
    insider_activity: readObjects_(SSMK.sheets.insiderActivity),
    hypothesis_lab: readObjects_(SSMK.sheets.hypothesisLab)
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate)),
    hypothesis_reviews: readObjects_(SSMK.sheets.hypothesisReviews)
      .filter((row) => sameDateText_(row.review_date, targetIssueDate) || sameDateText_(row.issue_date, targetIssueDate)),
    hypothesis_evolution_log: readObjects_(SSMK.sheets.hypothesisEvolutionLog)
      .filter((row) => sameDateText_(row.issue_date, targetIssueDate)),
    visualization_queue: readObjects_(SSMK.sheets.visualizationQueue)
      .filter((row) => (
        String(row.report_id || '') === String(reportId || '') ||
        sameDateText_(row.issue_date, targetIssueDate)
      )),
    agent_review_log: readObjects_(SSMK.sheets.agentReviewLog)
      .filter((row) => (
        String(row.report_id || '') === String(reportId || '') ||
        sameDateText_(row.issue_date, targetIssueDate)
      )),
    qa_review_log: readObjects_(SSMK.sheets.qaReviewLog)
      .filter((row) => String(row.run_id || '') === String(runId || '')),
    source_policy: readObjects_(SSMK.sheets.sourcePolicy)
      .filter((row) => isTruthyText_(row.active || 'TRUE')),
    data_sources: readObjects_(SSMK.sheets.dataSources),
  };
}

function factCard_(issueDate, reportId, sectionKey, fields) {
  const data = fields || {};
  const ticker = String(data.ticker || '').trim().toUpperCase();
  const metric = String(data.metric_name || data.fact_type || 'fact').trim().replace(/\s+/g, '_');
  return {
    fact_id: data.fact_id || `FACT-${compactDate_(issueDate)}-${ticker || sectionKey}-${metric}-${data.period || 'NA'}`,
    issue_date: issueDate,
    report_id: reportId || '',
    section_key: sectionKey,
    ticker: ticker,
    asset_type: data.asset_type || '',
    fact_type: data.fact_type || '',
    metric_name: data.metric_name || '',
    period: data.period || '',
    value: data.value || '',
    unit: data.unit || '',
    comparison_value: data.comparison_value || '',
    comparison_label: data.comparison_label || '',
    source_key: data.source_key || '',
    source_url: data.source_url || '',
    source_date: data.source_date || issueDate,
    data_confidence: data.data_confidence || 'medium',
    data_status: data.data_status || 'present',
    missing_reason: data.missing_reason || '',
    notes: data.notes || '',
  };
}

function missingFactCard_(issueDate, reportId, sectionKey, metricName, reason) {
  return factCard_(issueDate, reportId, sectionKey, {
    fact_type: 'missing_data',
    metric_name: metricName,
    data_confidence: 'low',
    data_status: 'missing',
    missing_reason: reason || '이번 자동 수집에서 확인되지 않았습니다.',
  });
}

function buildMarketFactCards_(context) {
  const sourceContext = context || {};
  return (sourceContext.market_data || []).map((row) => factCard_(sourceContext.issue_date, sourceContext.report_id, 'market_map', {
    ticker: row.symbol,
    asset_type: row.asset_type || 'ticker',
    fact_type: 'price_change',
    metric_name: '1주 가격 변화',
    period: '1w',
    value: formatPercentChange_(row.change_pct_1w) || '',
    unit: '%',
    comparison_value: formatPercentChange_(row.change_pct_4w) || '',
    comparison_label: row.change_pct_4w ? '4w_change' : '',
    source_key: row.source || row.source_key || row.source_name || 'market_data',
    source_url: row.source_url || '',
    source_date: row.market_date || sourceContext.issue_date,
    data_confidence: row.data_confidence || 'medium',
    notes: '가격 변화는 학습 질문의 출발점이며 투자 판단이 아닙니다.',
  }));
}

function buildScoreFactCards_(context) {
  const sourceContext = context || {};
  return (sourceContext.weekly_scores || []).map((row) => factCard_(sourceContext.issue_date, sourceContext.report_id, 'stock_dashboard', {
    ticker: row.ticker,
    asset_type: 'ticker',
    fact_type: 'weekly_score',
    metric_name: 'SSMK 관찰 점수',
    period: 'weekly',
    value: roundTo2_(estimateScoreFromRow_(row)),
    unit: 'score',
    comparison_value: row.score_change || '',
    comparison_label: 'score_change',
    source_key: 'weekly_scores',
    data_confidence: row.data_confidence || 'medium',
    notes: '점수는 투자 판단이 아니라 질문 선택 도구입니다.',
  }));
}

function buildReportFactCards_(context) {
  const sourceContext = context || {};
  const marketRows = sourceContext.market_data || [];
  const scoreRows = sourceContext.weekly_scores || [];
  const cards = []
    .concat(buildMarketFactCards_(sourceContext))
    .concat(buildScoreFactCards_(sourceContext));
  if (marketRows.length === 0) {
    cards.push(missingFactCard_(sourceContext.issue_date, sourceContext.report_id, 'market_map', 'market_data', 'market_data 행이 아직 없습니다.'));
  }
  if (scoreRows.length === 0) {
    cards.push(missingFactCard_(sourceContext.issue_date, sourceContext.report_id, 'stock_dashboard', 'weekly_scores', 'weekly_scores 행이 아직 없습니다.'));
  }
  return cards;
}

function deleteRowsByColumnValue_(sheetName, keyHeader, keyValue) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return 0;

  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
  const headers = values[0];
  const keyColumn = headers.indexOf(keyHeader) + 1;
  if (keyColumn < 1) return 0;

  let deletedCount = 0;
  for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
    if (String(values[rowIndex][keyColumn - 1] || '').trim() === String(keyValue || '').trim()) {
      sheet.deleteRow(rowIndex + 1);
      deletedCount += 1;
    }
  }
  return deletedCount;
}

function replaceReportFactCardsForReport_(reportId, factCards) {
  const normalizedReportId = String(reportId || '').trim();
  if (!normalizedReportId) return { deleted_count: 0, inserted_count: 0 };

  const deletedCount = deleteRowsByColumnValue_(SSMK.sheets.reportFactCards, 'report_id', normalizedReportId);
  const cards = (factCards || []).filter((card) => String(card.report_id || '').trim() === normalizedReportId);
  cards.forEach((card) => appendObject_(SSMK.sheets.reportFactCards, SSMK.headers.reportFactCards, card));
  return {
    deleted_count: deletedCount,
    inserted_count: cards.length,
  };
}

function topScoreRows_(context, count) {
  return (context.weekly_scores || [])
    .slice()
    .sort((a, b) => estimateScoreFromRow_(b) - estimateScoreFromRow_(a))
    .slice(0, count || context.top_n || 3);
}

function marketChangeTextForTicker_(context, ticker) {
  const symbol = String(ticker || '').trim().toUpperCase();
  const row = context.market_by_symbol && context.market_by_symbol[symbol];
  if (!row) return `${symbol || '티커'} 가격 변화 미수집`;
  return `1주 ${formatPercentChange_(row.change_pct_1w) || '미확인'}, 4주 ${formatPercentChange_(row.change_pct_4w) || '미확인'}`;
}

function marketRowForTicker_(context, ticker) {
  const symbol = String(ticker || '').trim().toUpperCase();
  return context && context.market_by_symbol ? context.market_by_symbol[symbol] : null;
}

function describeScoreChange_(row) {
  const scoreChange = toNumberOrBlank_(row && row.score_change);
  if (scoreChange === '') return '점수 변화는 아직 계산되지 않았습니다';
  if (scoreChange > 0.2) return `점수도 ${formatSignedNumber_(scoreChange)} 올라 가격 변화와 같은 방향입니다`;
  if (scoreChange < -0.2) return `점수는 ${formatSignedNumber_(scoreChange)} 내려 가격 변화와 엇갈립니다`;
  return `점수 변화는 ${formatSignedNumber_(scoreChange)}로 거의 없었습니다`;
}

function hypothesisDirection_(marketRow, row) {
  const oneWeek = toNumberOrBlank_(marketRow && marketRow.change_pct_1w);
  const fourWeek = toNumberOrBlank_(marketRow && marketRow.change_pct_4w);
  const scoreChange = toNumberOrBlank_(row && row.score_change);
  const scoreText = describeScoreChange_(row);
  if (oneWeek === '' && fourWeek === '') {
    return `가격 변화가 비어 있어 방향성 판단은 보류하지만, ${scoreText}. 먼저 데이터 공백부터 채워야 합니다.`;
  }
  if (oneWeek >= 8 && (scoreChange === '' || scoreChange >= -0.2)) {
    return `1주 가격이 ${formatPercentChange_(oneWeek)} 상승했고 ${scoreText}. 이는 시장이 해당 종목의 성장 기대를 다시 가격에 반영한 흐름으로 판단할 수 있습니다.`;
  }
  if (oneWeek >= 8 && scoreChange < -0.2) {
    return `1주 가격은 ${formatPercentChange_(oneWeek)} 올랐지만 ${scoreText}. 이는 주가 기대가 먼저 움직였고 SSMK 점수의 기초 조건은 아직 따라오지 못한 상태로 판단할 수 있습니다.`;
  }
  if (oneWeek <= -8) {
    return `1주 가격이 ${formatPercentChange_(oneWeek)} 하락했습니다. 이는 단기 기대가 약해졌거나 가격 부담이 조정되는 흐름으로 판단할 수 있습니다.`;
  }
  return `1주 가격 변화는 ${formatPercentChange_(oneWeek)}로 크지 않습니다. 따라서 이번 주 가설은 급등락보다 점수와 핵심 지표가 어느 방향으로 움직였는지를 중심으로 판단해야 합니다.`;
}

function abnormalMoveLine_(marketRow) {
  const oneWeek = toNumberOrBlank_(marketRow && marketRow.change_pct_1w);
  const fourWeek = toNumberOrBlank_(marketRow && marketRow.change_pct_4w);
  const hasExtremeMove = (oneWeek !== '' && Math.abs(oneWeek) >= 20) || (fourWeek !== '' && Math.abs(fourWeek) >= 40);
  if (!hasExtremeMove) return '';
  return `데이터 신뢰도 확인: 1주 ${formatPercentChange_(oneWeek) || '미확인'}, 4주 ${formatPercentChange_(fourWeek) || '미확인'}처럼 변화폭이 매우 큽니다. 먼저 실적 서프라이즈, 인수합병, 주식분할, ADR/OTC 가격 공백, GoogleFinance 계산 오류 가능성을 대조한 뒤 해석합니다.`;
}

function clearMetricList_(row) {
  return String(row && row.evidence_metrics || '').trim() || '가격 변화, SSMK 점수, 관련 뉴스, 다음 실적 지표';
}

function teachingHypothesisExpectation_(context, row) {
  const symbol = String(row.ticker || row.symbol || '').trim().toUpperCase();
  const marketRow = marketRowForTicker_(context, symbol);
  const metrics = clearMetricList_(row);
  const abnormalLine = abnormalMoveLine_(marketRow);
  if (abnormalLine) {
    return `${symbol}의 급격한 가격 변화가 실제 이벤트로 확인된다면, 시장은 ${metrics} 개선을 선반영했다고 예상할 수 있습니다. 반대로 데이터 오류나 일회성 이벤트라면 이번 상승을 지속 추세로 해석하면 안 됩니다.`;
  }
  return `${symbol}의 가격 변화와 점수 흐름이 같은 방향으로 유지된다면, 시장은 ${metrics} 개선 가능성을 가격에 반영하는 추세로 예상할 수 있습니다.`;
}

function teachingBeginnerLessonForRow_(context, row) {
  const symbol = String(row.ticker || row.symbol || '이 종목').trim().toUpperCase();
  return `${symbol} 사례에서 초보자는 "많이 올랐다" 또는 "많이 내렸다"를 결론으로 받아들이지 말고, 가격 변화가 어떤 사업 지표 개선을 예상한 것인지 분리해서 읽어야 합니다.`;
}

function buildTeachingHypothesisCard_(context, row, index) {
  const parts = teachingHypothesisParts_(context, row, index);
  return [
    `### ${parts.detail_title}`,
    `- 관찰된 사실: ${parts.actual_change}`,
    parts.data_reliability_note ? `- ${parts.data_reliability_note}` : '',
    `- 해석: ${parts.interpretation}`,
    `- 한 줄 가설: ${parts.one_line_hypothesis}`,
    `- 근거 지표: ${parts.evidence_metrics}`,
    `- 초보자 레슨: ${parts.beginner_lesson}`,
    `- ${parts.counter_scenario}`,
    `- ${parts.revision_rule}`,
    `- 다음 검증 데이터: ${parts.next_validation_data}`,
  ].filter(Boolean).join('\n');
}

function teachingHypothesisParts_(context, row, index) {
  const symbol = String(row.ticker || row.symbol || '').trim().toUpperCase();
  const marketRow = marketRowForTicker_(context, symbol);
  const score = roundTo2_(estimateScoreFromRow_(row));
  const metrics = clearMetricList_(row);
  const marketText = marketChangeTextForTicker_(context, symbol);
  const direction = hypothesisDirection_(marketRow, row);
  const abnormalLine = abnormalMoveLine_(marketRow);
  const expectation = teachingHypothesisExpectation_(context, row);
  const counterScenario = `반대 시나리오: 다음 실적이나 산업 데이터에서 ${metrics}가 개선되지 않거나, 가격만 먼저 오른 것으로 확인되면 이번 가설은 약해집니다.`;
  const revisionRule = `가설 수정 기준: 1주 뒤 가격과 점수가 반대로 움직이거나, 4주 뒤에도 ${metrics} 개선 근거가 나오지 않으면 "성장 기대가 실적으로 이어진다"는 가설을 "기대가 가격에 먼저 반영됐지만 근거 확인이 부족하다"는 가설로 낮춰야 합니다.`;
  const beginnerLesson = teachingBeginnerLessonForRow_(context, row);
  const nextCheck = row.next_check || `${metrics}, 다음 실적 발표, 관련 뉴스, 1주/4주 가격 변화`;

  return {
    detail_title: `가설 ${index + 1}. ${compactRowName_(row)}`,
    actual_change: `${marketText}, SSMK 점수 ${score}. ${describeScoreChange_(row)}.`,
    data_reliability_note: abnormalLine,
    interpretation: direction,
    one_line_hypothesis: expectation,
    evidence_metrics: metrics,
    beginner_lesson: beginnerLesson,
    counter_scenario: counterScenario,
    revision_rule: revisionRule,
    next_validation_data: nextCheck,
  };
}

function teachingHypothesisContentBlock_(section, context, row, index) {
  const parts = teachingHypothesisParts_(context, row, index);
  return contentBlock_(section, {
    detail_title: parts.detail_title,
    reader_question: '이 가격 변화는 어떤 사업 기대를 미리 반영한 것일까?',
    actual_change: parts.actual_change,
    data_reliability_note: parts.data_reliability_note,
    interpretation: parts.interpretation,
    one_line_hypothesis: parts.one_line_hypothesis,
    evidence_metrics: parts.evidence_metrics,
    beginner_lesson: parts.beginner_lesson,
    counter_scenario: parts.counter_scenario,
    revision_rule: parts.revision_rule,
    next_validation_data: parts.next_validation_data,
    next_check: parts.next_validation_data,
    missing_data_note: row.limitations || '',
    data_confidence: row.data_confidence || 'medium',
  });
}

function summarizeMarketChangesForLearning_(context) {
  if (!context.market_data || context.market_data.length === 0) {
    return '가격 변화 데이터가 아직 없어 시장 방향을 가격 변화로 확인하지 못했습니다.';
  }

  const rows = context.market_data
    .slice()
    .filter((row) => toNumberOrBlank_(row.change_pct_1w) !== '')
    .sort((a, b) => Math.abs(toNumberOrBlank_(b.change_pct_1w)) - Math.abs(toNumberOrBlank_(a.change_pct_1w)))
    .slice(0, 5);
  if (rows.length === 0) return '가격 변화 데이터는 있지만 1주 가격 변화 수식이 아직 계산되지 않았습니다.';
  return rows.map((row) => `${row.symbol || row.name}: ${formatPercentChange_(row.change_pct_1w)}`).join(', ');
}

function compareEtfChange_(context, firstTicker, secondTicker) {
  const first = context.market_by_symbol && context.market_by_symbol[String(firstTicker || '').toUpperCase()];
  const second = context.market_by_symbol && context.market_by_symbol[String(secondTicker || '').toUpperCase()];
  const firstChange = first ? toNumberOrBlank_(first.change_pct_1w) : '';
  const secondChange = second ? toNumberOrBlank_(second.change_pct_1w) : '';
  if (firstChange === '' || secondChange === '') return '';
  if (firstChange === secondChange) return `${firstTicker}와 ${secondTicker}의 1주 변화가 비슷해 이번 주에는 성장주와 배당주의 선호 차이가 크지 않았다고 봅니다.`;
  return firstChange > secondChange
    ? `${firstTicker}가 ${secondTicker}보다 강해 시장이 배당 안정성보다 성장 기대를 더 크게 반영한 주간으로 해석할 수 있습니다. 이 흐름이 XLK 강세와 같이 나오면 기술주 중심 위험 선호 가설을 유지합니다.`
    : `${secondTicker}가 ${firstTicker}보다 강해 시장이 성장 기대보다 배당 또는 방어 성격을 더 의식한 주간으로 해석할 수 있습니다. 이 흐름이 다음 주에도 이어지면 방어적 시장 전환 가설을 높입니다.`;
}

function groupSummary_(rows, fieldName, fallback) {
  const counts = {};
  (rows || []).forEach((row) => {
    const rawValue = String(row[fieldName] || '').trim();
    const key = rawValue || fallback || '미분류';
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 5)
    .map((key) => `${key} ${counts[key]}개`)
    .join(', ') || '분류 데이터 없음';
}

function compactRowName_(row) {
  const symbol = String(row && (row.ticker || row.symbol) || '-').trim().toUpperCase();
  const company = String(row && (row.company || row.name) || '').trim();
  return `${symbol}${company && company.toUpperCase() !== symbol ? `(${company})` : ''}`;
}

function weeklyScoreLine_(context, row, index) {
  const score = roundTo2_(estimateScoreFromRow_(row));
  const scoreChange = formatSignedNumber_(row.score_change);
  return `${index + 1}. ${compactRowName_(row)}: 점수 ${score}, 등급 ${row.observation_grade || '-'}, 점수 변화 ${scoreChange || '신규/미확인'}, 가격 변화 ${marketChangeTextForTicker_(context, row.ticker)}`;
}

function learningFlowMarkdown_(section, actualLines, interpretationLines, lessonLines, questionLines, missingLines) {
  const blocks = [
    `## ${section.section_title}`,
    '',
    '### 실제 변화',
    bulletLines_(actualLines),
    '',
    '### 해석',
    bulletLines_(interpretationLines),
    '',
    '### 초보자 레슨',
    bulletLines_(lessonLines),
    '',
    '### 다음 확인 질문',
    bulletLines_(questionLines),
  ];
  if (missingLines && missingLines.length > 0) {
    blocks.push('', '### 부족한 데이터', bulletLines_(missingLines));
  }
  return blocks.join('\n');
}

function bulletLines_(lines) {
  const normalized = (lines || []).filter((line) => String(line || '').trim());
  if (normalized.length === 0) return '- 확인할 데이터가 아직 없습니다.';
  return normalized.map((line) => `- ${line}`).join('\n');
}

function sectionDisplayTitle_(section) {
  const key = String(section && section.section_key || '').trim();
  return String(section && section.visible_title_ko || '').trim()
    || WEEKLY_LAB_READER_TITLES[key]
    || String(section && section.section_title || key || '이번 주 학습 섹션').trim();
}

function compactLearnerLength_(text) {
  return String(text || '').replace(/\s+/g, '').length;
}

function learnerSourceLabel_(key) {
  const labels = {
    weekly_scores: '관찰 점수 데이터',
    market_data: '가격 변화 데이터',
    news_events: '뉴스 이벤트',
    source_policy: '출처 확인 기록',
    data_sources: '출처 목록',
    sector_theme_scores: '산업/테마 점수',
    company_fundamentals: '기업 기초지표',
    revenue_breakdown: '매출 구성',
    shareholder_returns: '주주환원 데이터',
    insider_activity: '내부자 거래',
    etf_watch: 'ETF 관찰 데이터',
    hypothesis_lab: '가설 기록',
    hypothesis_reviews: '지난 가설 복기',
    qa_review_log: '품질 점검 기록',
  };
  return labels[key] || key;
}

function replaceInternalSourceNames_(text) {
  let output = String(text || '');
  [
    'weekly_scores',
    'market_data',
    'news_events',
    'source_policy',
    'data_sources',
    'sector_theme_scores',
    'company_fundamentals',
    'revenue_breakdown',
    'shareholder_returns',
    'insider_activity',
    'etf_watch',
    'hypothesis_lab',
    'hypothesis_reviews',
    'qa_review_log',
  ].forEach((key) => {
    output = output.replace(new RegExp(key, 'g'), learnerSourceLabel_(key));
  });
  return output;
}

function cleanLearnerFacingText_(text) {
  return replaceInternalSourceNames_(String(text || ''))
    .replace(/사용 데이터\s*:/g, '이번 리포트에 사용한 자료:')
    .replace(/출처 정책 행\s*:/g, '출처 확인 기록:')
    .replace(/주요 ETF 가격 변화:\s*미수집/g, '주요 ETF 가격 변화는 아직 자동 수집되지 않았습니다')
    .replace(/주주환원 데이터\s+ETF 관찰 데이터\s+주요 ETF 가격 변화 데이터/g, '주주환원 데이터, ETF 관찰 데이터, 주요 ETF 가격 변화 데이터')
    .replace(/기업 기초지표\s+주주환원 데이터\s+ETF 관찰 데이터/g, '기업 기초지표, 주주환원 데이터, ETF 관찰 데이터')
    .replace(
      /이전 가설의 실제 진행 방향을 아직 기록하지 못했으므로 이번 리포트에서는 해당 가설을 평가하면 안 됩니다\./g,
      '이전 가설의 실제 진행 방향이 아직 비어 있어 이번 주에는 결론을 내리지 않습니다. 대신 다음 복기에서 가격, 점수, 핵심 지표가 어느 방향으로 움직였는지 채운 뒤 가설을 유지할지 낮출지 정합니다.'
    )
    .replace(
      /이번 리포트에서는 해당 가설을 평가하면 안 됩니다\./g,
      '이번 주에는 결론을 내리지 않습니다. 실제 결과가 채워진 뒤에 가설을 유지할지 낮출지 정합니다.'
    );
}

function learnerExpansionByLabel_(sectionKey, label) {
  const section = String(sectionKey || '');
  const sectionSpecific = {
    executive_dashboard: {
      interpretation: '전체 대시보드는 이번 주 공부할 순서를 정하는 첫 장입니다. 점수가 높은 종목과 크게 움직인 종목을 함께 보면, 시장이 어디에 기대를 두었고 어디에서 의심이 생겼는지 큰 그림을 잡을 수 있습니다.',
      beginner_lesson: '처음에는 상위 종목을 정답처럼 받아들이기 쉽지만, 이 표는 정답지가 아니라 질문 목록입니다. 왜 점수가 높았는지, 왜 가격이 움직였는지, 어떤 데이터가 비어 있는지를 나누면 한 주의 공부 방향이 선명해집니다.',
    },
    market_map: {
      actual_change: 'ETF 변화는 개별 종목보다 먼저 보는 시장 온도계입니다. SPY는 전체 시장, QQQ는 성장주, SCHD는 배당주, XLK는 기술주, XLE는 에너지 흐름을 대략 보여주므로 서로 비교해야 의미가 생깁니다.',
      interpretation: '시장 지도가 비어 있거나 일부만 있으면 성장주와 배당주 선호를 강하게 말할 수 없습니다. 이런 경우에는 개별 종목 해석도 한 단계 낮춰서, 시장 바람이 뒷받침되는지 아직 확인 전이라고 읽는 편이 안전합니다.',
      beginner_lesson: '개별 종목이 좋아 보여도 시장 전체가 반대 방향이면 해석의 강도를 낮춰야 합니다. 그래서 ETF 비교는 종목을 사거나 팔기 위한 신호가 아니라, 내가 세운 가설이 시장의 큰 흐름과 같은 방향인지 보는 연습입니다.',
      next_check: '다음에는 SPY, QQQ, SCHD, XLK, XLE의 1주와 4주 변화를 먼저 채운 뒤, 이번 주 강했던 종목이 어느 ETF 흐름과 닮았는지 비교합니다. 이 비교가 있어야 성장 기대인지 방어 선호인지 더 분명해집니다.',
    },
    industry_theme_board: {
      interpretation: '산업은 회사가 실제로 돈을 버는 자리이고, 테마는 시장이 붙이는 이야기입니다. 같은 AI라는 단어가 붙어도 클라우드, 반도체, 광고, 헬스케어는 매출 구조와 위험 요인이 다르기 때문에 한 묶음으로 결론내리면 안 됩니다.',
      beginner_lesson: '초보자는 유행어보다 본업을 먼저 봐야 합니다. 테마가 강할수록 그 회사의 실제 매출이 어디서 나오고, 그 매출이 이번 가격 변화와 연결되는지 확인해야 이야기와 숫자를 분리할 수 있습니다.',
    },
    stock_dashboard: {
      interpretation: '종목 대시보드는 순위를 매기는 화면이 아니라 관찰 질문을 고르는 화면입니다. 가격은 올랐는데 점수가 그대로라면 기대가 먼저 움직였을 수 있고, 점수는 좋아졌는데 가격이 약하면 시장이 아직 확신하지 못한 상태일 수 있습니다.',
      beginner_lesson: '한 종목을 볼 때 회사의 질, 산업의 방향, 현재 가격 부담을 나누면 점수 하나에 끌려가지 않습니다. 이렇게 보면 어떤 근거가 강하고 어떤 근거가 약한지 차분하게 볼 수 있습니다.',
    },
    lens_deep_dive: {
      interpretation: '깊게 보기에서는 좋은 뉴스보다 사업 숫자가 더 중요합니다. 가격 변화가 이어지려면 매출 성장, 마진, 현금흐름, 투자비 부담 중 적어도 몇 가지가 같은 방향으로 설명되어야 합니다.',
      beginner_lesson: '한 종목을 깊게 볼 때는 좋아 보이는 이야기에서 멈추지 않습니다. 돈을 어디서 벌고, 그 시장이 커지고, 이익으로 남고, 현재 가격이 그 기대를 얼마나 반영했는지 순서대로 분해합니다.',
    },
    hypothesis_lab: {
      actual_change: '가설의 출발점은 실제로 관찰된 가격과 점수 변화입니다. 변화폭이 크면 먼저 데이터가 정상인지 확인하고, 변화폭이 작으면 가격보다 점수와 근거 지표가 어떤 방향인지 더 자세히 봅니다.',
      interpretation: '가설은 질문이 아니라 임시 판단입니다. 어떤 지표가 좋아지면 유지하고, 어떤 지표가 따라오지 않으면 낮출지까지 정해야 다음 주 복기에서 배울 수 있습니다.',
      beginner_lesson: '좋은 가설은 멋진 문장이 아니라 나중에 틀렸는지 확인할 수 있는 문장입니다. 관찰된 사실, 근거 지표, 반대 시나리오, 수정 기준을 함께 적어야 다음 리포트에서 같은 기준으로 복기할 수 있습니다.',
      next_check: '다음 복기에서는 가격만 보지 않고 점수 변화와 근거 지표를 함께 봅니다. 가격이 먼저 움직였는지, 실제 사업 숫자가 뒤따랐는지, 반대 시나리오가 살아났는지를 순서대로 확인합니다.',
    },
    forecast_vs_actual: {
      interpretation: '지난 가설 복기는 맞혔는지 자랑하는 코너가 아닙니다. 예상과 실제가 달랐던 지점을 찾고, 그 차이가 데이터 누락인지 시장 기대 변화인지 구분하는 학습 장치입니다.',
      beginner_lesson: '예측이 틀렸을 때 바로 실패라고 끝내면 배울 것이 사라집니다. 어떤 전제가 약했는지, 어떤 지표를 빠뜨렸는지, 다음에는 가설을 얼마나 낮춰야 하는지 기록해야 실력이 쌓입니다.',
      next_check: '다음 복기에서는 지난 가설, 예상 결과, 실제 결과, 달라진 이유, 수정된 가설을 한 줄씩 채웁니다. 이 다섯 칸이 채워져야 맞고 틀림보다 더 중요한 학습 기록이 됩니다.',
      missing_data_note: '복기 데이터가 비어 있으면 이번 주에는 결론을 내리지 않습니다. 대신 어떤 실제 결과가 필요했는지 남기고, 다음 실행에서 가격 변화, 점수 변화, 핵심 지표를 채워 가설을 다시 판단합니다.',
    },
    dividend_etf_corner: {
      actual_change: '배당주와 ETF는 수익률 숫자만 보면 오해하기 쉽습니다. 배당률이 높아진 이유가 배당금 증가인지 주가 하락인지, ETF가 분산되어 보여도 상위 종목에 쏠려 있는지 나눠 봐야 합니다.',
      interpretation: '배당과 ETF 해석은 안정성과 위험을 동시에 봅니다. 배당 지속성은 현금흐름과 배당성향으로 확인하고, ETF 흐름은 QQQ와 SCHD처럼 서로 다른 스타일을 비교해야 의미가 생깁니다.',
      beginner_lesson: '높은 배당률은 항상 좋은 신호가 아닙니다. 주가가 많이 내려 배당률이 높아졌을 수도 있으므로, 초보자는 배당률 숫자 옆에 현금흐름, 배당성향, 주가 흐름을 함께 놓아야 합니다.',
    },
    learning_notes: {
      interpretation: '이번 주 레슨은 일반 조언이 아니라 실제 사례에서 꺼낸 규칙이어야 합니다. 대표 종목의 가격 변화가 어떤 사업 지표를 미리 반영했는지 연결해야 다음 주에도 써먹을 수 있습니다.',
      beginner_lesson: '한 주의 공부가 남으려면 문장을 내 언어로 바꿔야 합니다. 많이 올랐다, 많이 내렸다는 표현을 넘어서 어떤 기대가 생겼고 어떤 숫자로 확인해야 하는지 적어야 합니다.',
    },
    sources_limitations: {
      interpretation: '출처와 한계는 리포트의 안전장치입니다. 아는 것과 모르는 것을 나누면 데이터가 비어 있는데도 확신하는 실수를 줄일 수 있고, 다음 자동화에서 무엇을 먼저 보강할지도 분명해집니다.',
      beginner_lesson: '모르는 것을 모른다고 쓰는 습관은 약점이 아니라 공부의 방어막입니다. 데이터가 부족한 구간에서는 결론을 낮추고, 어떤 자료가 채워져야 판단이 좋아지는지 적어 두는 편이 더 좋은 리포트입니다.',
    },
  };
  if (sectionSpecific[section] && sectionSpecific[section][label]) {
    return sectionSpecific[section][label];
  }
  const common = {
    actual_change: '이 숫자는 결론이 아니라 해석의 출발점입니다. 1주 변화와 4주 변화를 나눠 보면 단기 반응인지 누적 흐름인지 구분할 수 있고, 점수 변화와 함께 읽으면 기대가 실제 데이터로 이어지는지 볼 수 있습니다.',
    interpretation: '이 해석은 매수나 매도 판단이 아니라 다음에 검증할 전제를 고르는 과정입니다. 가격, 점수, 사업 지표가 같은 방향이면 가설 신뢰도가 올라가고, 서로 엇갈리면 기대만 먼저 움직였을 가능성을 남깁니다.',
    beginner_lesson: '숫자는 외우는 대상이 아니라 질문을 만드는 재료입니다. 가격, 점수, 뉴스, 실적 중 무엇이 같은 방향이고 무엇이 비어 있는지 나누면 다음 주에도 같은 방식으로 복기할 수 있습니다.',
    next_check: '다음에는 이 질문을 실제 데이터로 다시 열어 봅니다. 가격 변화, 점수 변화, 실적 코멘트, 뉴스, ETF 흐름 중 어느 축이 같은 방향인지 대조하면 가설을 유지할지 낮출지 더 차분하게 정할 수 있습니다.',
    missing_data_note: '이 빈칸은 실패가 아니라 해석의 신뢰도 표시입니다. 데이터가 비어 있으면 강한 결론을 내리지 않고, 어떤 숫자가 채워져야 판단이 좋아지는지 먼저 적어 두는 편이 안전한 학습 방식입니다.',
    data_reliability_note: '변화폭이 크거나 데이터 출처가 제한적일수록 먼저 숫자가 정상인지 대조합니다. 실적 이벤트, 분할, 인수합병, 가격 공백, 계산 오류 가능성을 분리하면 큰 상승률이나 하락률을 성급한 결론으로 읽지 않을 수 있습니다.',
    one_line_hypothesis: '이 가설은 정답 선언이 아니라 다음 복기에서 시험할 문장입니다. 핵심 지표가 같은 방향으로 움직이면 유지하고, 가격만 먼저 움직였거나 근거 지표가 따라오지 않으면 더 낮은 신뢰도의 가설로 바꿉니다.',
    evidence_metrics: '이 지표들은 가설을 실제 숫자로 검증하기 위한 체크포인트입니다. 가격 변화가 먼저 보였더라도, 결국 매출, 마진, 현금흐름, 수요, ETF 흐름 같은 근거가 따라오는지 확인해야 해석의 힘이 생깁니다.',
    counter_scenario: '반대 시나리오는 가설을 공격하기 위한 장치입니다. 처음 생각과 다른 데이터가 나오면 틀렸다고 끝내지 않고, 어떤 전제가 약했는지 찾아 다음 가설을 더 작고 검증 가능하게 바꿉니다.',
    revision_rule: '수정 기준은 감으로 판단하지 않기 위한 약속입니다. 정해 둔 기간 뒤 가격, 점수, 핵심 지표가 함께 좋아지지 않으면 가설을 유지하지 않고 기대 선반영 또는 근거 부족 가설로 낮춥니다.',
    next_validation_data: '다음 검증 데이터는 복기할 때 다시 열어 볼 목록입니다. 이 목록이 구체적일수록 다음 리포트에서 맞혔는지보다 어떤 전제가 살아남았는지를 더 잘 배울 수 있습니다.',
  };
  const sectionHints = {
    market_map: ' 이 섹션에서는 개별 종목보다 먼저 SPY, QQQ, SCHD, XLK, XLE의 방향을 비교해 시장의 큰 바람을 읽습니다.',
    dividend_etf_corner: ' 배당과 ETF는 수익률 숫자보다 그 숫자를 만든 원인, 구성 종목 쏠림, 현금흐름의 지속성을 함께 읽습니다.',
    forecast_vs_actual: ' 지난 가설 복기는 맞히기 점수가 아니라 지난 전제가 실제 데이터 앞에서 어떻게 바뀌는지 기록하는 학습 장치입니다.',
    hypothesis_lab: ' 가설 실험실에서는 관찰된 사실, 예상, 반대 시나리오, 수정 기준을 한 카드에 묶어 다음 복기에서 바로 사용할 수 있게 남깁니다.',
    lens_deep_dive: ' SSMK 렌즈에서는 한 종목을 좋은 뉴스로 끝내지 않고 사업, 산업, 현금흐름, 가격 부담으로 나눠 읽습니다.',
    stock_dashboard: ' 종목 대시보드는 순위표가 아니라 이번 주 어떤 질문을 먼저 공부할지 고르는 지도입니다.',
    industry_theme_board: ' 산업과 테마는 서로 다릅니다. 본업에서 돈을 버는 구조와 시장이 좋아하는 이야기를 나눠 읽어야 합니다.',
    sources_limitations: ' 출처와 한계는 리포트의 방어막입니다. 아는 것과 모르는 것을 나누면 과장된 결론을 줄일 수 있습니다.',
  };
  return (common[label] || common.interpretation) + (sectionHints[section] || '');
}

function expandLearnerText_(sectionKey, label, text) {
  const cleaned = cleanLearnerFacingText_(text);
  const minimumLength = label === 'evidence_metrics' ? 55 : 70;
  if (compactLearnerLength_(cleaned) >= minimumLength) return cleaned;
  const addition = learnerExpansionByLabel_(sectionKey, label);
  if (!cleaned) return addition;
  return `${cleaned} ${addition}`;
}

function enrichContentBlockForLearning_(block) {
  const source = block || {};
  const sectionKey = source.section_key || '';
  return Object.assign({}, source, {
    actual_change: expandLearnerText_(sectionKey, 'actual_change', source.actual_change),
    data_reliability_note: source.data_reliability_note ? expandLearnerText_(sectionKey, 'data_reliability_note', source.data_reliability_note) : '',
    interpretation: expandLearnerText_(sectionKey, 'interpretation', source.interpretation),
    one_line_hypothesis: source.one_line_hypothesis ? expandLearnerText_(sectionKey, 'one_line_hypothesis', source.one_line_hypothesis) : '',
    evidence_metrics: source.evidence_metrics ? expandLearnerText_(sectionKey, 'evidence_metrics', source.evidence_metrics) : '',
    beginner_lesson: expandLearnerText_(sectionKey, 'beginner_lesson', source.beginner_lesson),
    counter_question: source.counter_question ? expandLearnerText_(sectionKey, 'counter_scenario', source.counter_question) : '',
    counter_scenario: source.counter_scenario ? expandLearnerText_(sectionKey, 'counter_scenario', source.counter_scenario) : '',
    revision_rule: source.revision_rule ? expandLearnerText_(sectionKey, 'revision_rule', source.revision_rule) : '',
    next_check: expandLearnerText_(sectionKey, 'next_check', source.next_check),
    next_validation_data: source.next_validation_data ? expandLearnerText_(sectionKey, 'next_validation_data', source.next_validation_data) : '',
    missing_data_note: source.missing_data_note ? expandLearnerText_(sectionKey, 'missing_data_note', source.missing_data_note) : '',
  });
}

function contentBlock_(section, options) {
  const data = options || {};
  return enrichContentBlockForLearning_({
    section_key: section.section_key,
    visible_title_ko: data.visible_title_ko || sectionDisplayTitle_(section),
    detail_title: data.detail_title || '',
    reader_question: data.reader_question || section.beginner_purpose || '이번 섹션에서 무엇을 배울 수 있는가?',
    source_fact_ids: data.source_fact_ids || [],
    actual_change: data.actual_change || '',
    data_reliability_note: data.data_reliability_note || '',
    interpretation: data.interpretation || '',
    one_line_hypothesis: data.one_line_hypothesis || '',
    evidence_metrics: data.evidence_metrics || '',
    beginner_lesson: data.beginner_lesson || '',
    counter_question: data.counter_question || '',
    counter_scenario: data.counter_scenario || '',
    revision_rule: data.revision_rule || '',
    next_check: data.next_check || '',
    next_validation_data: data.next_validation_data || '',
    missing_data_note: data.missing_data_note || '',
    data_confidence: data.data_confidence || 'medium',
  });
}

function contentBlocksFromSectionModel_(model) {
  if (model && Array.isArray(model.content_blocks) && model.content_blocks.length > 0) {
    return model.content_blocks;
  }
  return [];
}

function markdownLearningPart_(markdown, label) {
  const source = String(markdown || '');
  const pattern = new RegExp(`###\\s*${label}\\s*\\n([\\s\\S]*?)(?=\\n###\\s|$)`);
  const match = source.match(pattern);
  if (!match) return '';
  return match[1]
    .split(/\r?\n/)
    .map((line) => String(line || '').trim().replace(/^[-*]\s*/, ''))
    .filter((line) => line && !/^#+\s/.test(line))
    .join(' ');
}

function markdownBulletValue_(sectionText, label) {
  const source = String(sectionText || '');
  const pattern = new RegExp(`(?:^|\\n)\\s*[-*]\\s*${label}\\s*:\\s*([^\\n]+)`);
  const match = source.match(pattern);
  return match ? String(match[1] || '').trim() : '';
}

function hypothesisContentBlocksFromDocsMarkdown_(section, docsMarkdown) {
  const source = String(docsMarkdown || '');
  if (String(section && section.section_key || '') !== 'hypothesis_lab') return [];
  const matches = source.match(/(?:^|\n)###\s+가설\s+\d+\.[\s\S]*?(?=\n###\s+가설\s+\d+\.|\n##\s|$)/g) || [];
  return matches.map((cardText) => {
    const titleMatch = String(cardText || '').match(/###\s*(가설\s+\d+\.[^\n]+)/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    const nextValidationData = markdownBulletValue_(cardText, '다음 검증 데이터');
    return contentBlock_(section, {
      detail_title: title,
      reader_question: '이 가격 변화는 어떤 사업 기대를 미리 반영한 것일까?',
      actual_change: markdownBulletValue_(cardText, '관찰된 사실'),
      data_reliability_note: markdownBulletValue_(cardText, '데이터 신뢰도 확인'),
      interpretation: markdownBulletValue_(cardText, '해석'),
      one_line_hypothesis: markdownBulletValue_(cardText, '한 줄 가설'),
      evidence_metrics: markdownBulletValue_(cardText, '근거 지표'),
      beginner_lesson: markdownBulletValue_(cardText, '초보자 레슨'),
      counter_scenario: markdownBulletValue_(cardText, '반대 시나리오'),
      revision_rule: markdownBulletValue_(cardText, '가설 수정 기준'),
      next_validation_data: nextValidationData,
      next_check: nextValidationData,
      data_confidence: markdownBulletValue_(cardText, '데이터 신뢰도 확인') ? 'medium' : 'high',
    });
  }).filter((block) => block.actual_change || block.one_line_hypothesis || block.revision_rule);
}

function contentBlocksFromDocsMarkdown_(section, docsMarkdown, missingData) {
  const hypothesisBlocks = hypothesisContentBlocksFromDocsMarkdown_(section, docsMarkdown);
  if (hypothesisBlocks.length > 0) return hypothesisBlocks;

  const actualChange = markdownLearningPart_(docsMarkdown, '실제 변화');
  const interpretation = markdownLearningPart_(docsMarkdown, '해석');
  const beginnerLesson = markdownLearningPart_(docsMarkdown, '초보자 레슨');
  const nextCheck = markdownLearningPart_(docsMarkdown, '다음 확인 질문');
  if (!actualChange && !interpretation && !beginnerLesson && !nextCheck) {
    return [];
  }
  const missingDataNote = markdownLearningPart_(docsMarkdown, '부족한 데이터') || String(missingData || '').trim();
  return [contentBlock_(section, {
    actual_change: actualChange,
    interpretation: interpretation,
    beginner_lesson: beginnerLesson,
    next_check: nextCheck,
    missing_data_note: missingDataNote,
    data_confidence: missingDataNote ? 'medium' : 'high',
  })];
}

function sectionModel_(blueprint, docsMarkdown, emailSummary, missingData, notes) {
  const hasUsableContent = String(docsMarkdown || emailSummary || '').trim().length > 0;
  const explicitBlocks = Array.isArray(blueprint.content_blocks) ? blueprint.content_blocks : [];
  return {
    section_key: blueprint.section_key,
    section_order: blueprint.section_order,
    section_title: blueprint.section_title,
    visible_title_ko: blueprint.visible_title_ko || sectionDisplayTitle_(blueprint),
    required: blueprint.required,
    docs_output: blueprint.docs_output,
    email_output: blueprint.email_output,
    status: hasUsableContent ? 'draft' : 'needs_revision',
    docs_markdown: docsMarkdown,
    email_html_summary: emailSummary,
    content_blocks: explicitBlocks.length > 0 ? explicitBlocks : contentBlocksFromDocsMarkdown_(blueprint, docsMarkdown, missingData),
    missing_data: missingData || '',
    data_sources: blueprint.data_sources || '',
    quality_rule: blueprint.quality_rule || '',
    beginner_purpose: blueprint.beginner_purpose || '',
    notes: notes || blueprint.notes || '',
  };
}

function buildExecutiveDashboardSection_(section, context, topRows) {
  const missing = [];
  if ((context.weekly_scores || []).length === 0) missing.push('weekly_scores');
  if ((context.market_data || []).length === 0) missing.push('market_data');
  const actual = [
    `관찰 점수 데이터 ${context.weekly_scores.length}개와 가격 변화 데이터 ${context.market_data.length}개를 기준으로 이번 주 관찰 질문을 만들었습니다.`,
    topRows.length > 0 ? `관찰 점수 상위: ${topRows.slice(0, context.top_n).map((row) => `${compactRowName_(row)} 관찰점수 ${roundTo2_(estimateScoreFromRow_(row))}`).join(', ')}` : '관찰 점수 상위 종목이 아직 없습니다.',
    `가격 변화가 큰 항목: ${summarizeMarketChangesForLearning_(context)}`,
  ];
  const docs = learningFlowMarkdown_(section, actual, [
    '점수는 답이 아니라 이번 주 먼저 공부할 질문을 고르는 도구입니다.',
    '가격 변화와 점수 변화가 같은 방향인지, 다른 방향인지가 이번 주 해석의 출발점입니다.',
  ], [
    '초보자는 한 종목의 총점보다 그 점수를 만든 가격, 산업, 배당, 이벤트 질문을 나눠 보는 연습을 해야 합니다.',
  ], [
    '가장 많이 움직인 종목의 변화가 뉴스, 실적, 산업 흐름 중 무엇과 연결되는가?',
    '점수가 높은 종목이 투자 판단처럼 읽히지 않도록 어떤 추가 데이터를 확인해야 하는가?',
  ], missing);
  return sectionModel_(section, docs, `이번 주는 관찰 점수 ${context.weekly_scores.length}개와 가격 변화 ${context.market_data.length}개로 Top ${context.top_n} 학습 질문을 정리했습니다.`, missing.join(', '), '');
}

function buildMarketMapSection_(section, context) {
  const etfTickers = ['SPY', 'QQQ', 'SCHD', 'XLK', 'XLE'];
  const lines = etfTickers.map((ticker) => {
    const text = marketChangeTextForTicker_(context, ticker);
    return /미수집|미확인/.test(text)
      ? `${ticker}: 가격 변화 데이터 미수집`
      : `${ticker}: ${text}`;
  });
  const comparison = compareEtfChange_(context, 'QQQ', 'SCHD') || 'QQQ와 SCHD 비교 데이터가 부족해 성장주/배당주 선호는 보수적으로만 해석합니다.';
  const missing = lines.filter((line) => /미수집|미확인/.test(line)).length > 0 ? ['주요 ETF 가격 변화 일부'] : [];
  const docs = learningFlowMarkdown_(section, lines, [
    comparison,
    '개별 종목을 보기 전에 시장 전체, 성장주, 배당주, 기술주, 에너지 흐름을 먼저 나눠 봅니다.',
  ], [
    'ETF는 시장의 큰 바람을 보는 기초 도구입니다. ETF가 강하다고 바로 매수 근거가 되는 것은 아닙니다.',
  ], [
    'QQQ, SCHD, XLK, XLE 중 어느 흐름이 관찰 종목의 움직임과 같은 방향인가?',
  ], missing);
  return sectionModel_(section, docs, `${comparison} 주요 ETF 가격 변화는 Docs 초안에서 함께 확인합니다.`, missing.join(', '), '');
}

function buildIndustryThemeBoardSection_(section, context, topRows) {
  const sourceRows = topRows.length > 0 ? topRows : context.weekly_scores;
  const themeExamples = sourceRows.slice(0, 5)
    .map((row) => `${compactRowName_(row)}: ${row.theme_tags || '테마 미입력'}`)
    .join(' / ') || '테마 데이터 없음';
  const actual = [
    `산업 분포: ${groupSummary_(sourceRows, 'core_industry', '산업 미입력')}`,
    `투자 성격 분포: ${groupSummary_(sourceRows, 'investment_style', '성격 미입력')}`,
    `테마 키워드 예시: ${themeExamples}`,
  ];
  const missing = (context.sector_theme_scores || []).length === 0 ? ['sector_theme_scores'] : [];
  const docs = learningFlowMarkdown_(section, actual, [
    '산업은 회사가 실제로 돈을 버는 본업이고, 테마는 시장이 관심을 갖는 이야기입니다.',
    '같은 AI 테마라도 광고, 클라우드, 반도체, 헬스케어는 사업 구조가 다릅니다.',
  ], [
    '초보자는 테마 이름만 보고 묶지 않습니다. 실제 매출이 어디서 나오는지 알아야 같은 AI 이야기라도 광고, 클라우드, 반도체를 다르게 읽을 수 있습니다.',
  ], [
    '이번 주 강한 테마가 실제 산업 지표나 실적 데이터로도 확인되는가?',
  ], missing);
  return sectionModel_(section, docs, `상위 관찰 종목의 산업은 ${groupSummary_(sourceRows, 'core_industry', '산업 미입력')}로 나뉩니다. 테마와 본업을 분리해서 봅니다.`, missing.join(', '), '');
}

function buildStockDashboardSection_(section, context, topRows) {
  const actual = topRows.length > 0
    ? topRows.map((row, index) => weeklyScoreLine_(context, row, index))
    : ['관찰 점수 데이터 기준 Top 종목이 아직 없습니다.'];
  const missing = topRows.length === 0 ? ['weekly_scores'] : [];
  const docs = learningFlowMarkdown_(section, actual, [
    '총점이 높은 순서가 투자 순서는 아닙니다. 각 행은 이번 주 먼저 질문을 던질 관찰 후보입니다.',
    '점수 변화와 가격 변화가 엇갈리면 기대와 실제 데이터 사이의 차이를 볼 수 있습니다.',
  ], [
    '좋은 회사, 좋은 산업, 좋은 가격은 서로 다른 질문입니다.',
  ], [
    'Top 종목의 점수를 올린 항목과 깎은 항목은 무엇인가?',
    '데이터 신뢰도가 낮은 종목은 어떤 사실 확인을 먼저 해야 하는가?',
  ], missing);
  return sectionModel_(section, docs, `관찰 점수 Top ${context.top_n}: ${topRows.map((row) => `${compactRowName_(row)} ${roundTo2_(estimateScoreFromRow_(row))}`).join(', ') || '데이터 없음'}. 점수는 질문 선택 도구입니다.`, missing.join(', '), '');
}

function buildLensDeepDiveSection_(section, context, topRows) {
  const row = topRows[0] || {};
  const symbol = String(row.ticker || '').trim().toUpperCase();
  const fundamentals = context.company_fundamentals.filter((item) => String(item.ticker || '').trim().toUpperCase() === symbol);
  const shareholderRows = context.shareholder_returns.filter((item) => String(item.ticker || '').trim().toUpperCase() === symbol);
  const missing = [];
  if (!symbol) missing.push('weekly_scores Top 1');
  if (fundamentals.length === 0) missing.push('company_fundamentals');
  if (shareholderRows.length === 0) missing.push('shareholder_returns');
  const actual = symbol ? [
    `대상: ${compactRowName_(row)}, ${marketChangeTextForTicker_(context, symbol)}, 점수 ${roundTo2_(estimateScoreFromRow_(row))}`,
    `사업/산업: ${row.core_industry || '산업 미입력'} / ${row.theme_tags || '테마 미입력'}`,
    `현재 가설: ${teachingHypothesisExpectation_(context, row)}`,
  ] : ['깊게 볼 Top 종목이 아직 없습니다.'];
  const docs = learningFlowMarkdown_(section, actual, [
    'SSMK 렌즈는 돈을 어디서 버는지, 그 시장이 커지는지, 이익과 현금으로 남는지, 가격이 기대를 얼마나 반영했는지를 나눠 봅니다.',
    '현재 자동화는 가격/점수 중심이므로 실적 세부 데이터가 없을 때는 한계를 분명히 적어야 합니다.',
  ], [
    '초보자는 한 종목을 깊게 볼 때 좋은 뉴스에서 멈추지 않습니다. 매출, 마진, 현금흐름, 가격 부담을 차례로 놓아야 뉴스가 실제 숫자로 이어지는지 알 수 있습니다.',
  ], [
    `${symbol || 'Top 종목'}의 다음 실적에서 확인해야 할 핵심 숫자는 무엇인가?`,
    '현재 가격 변화가 실적 개선인지 기대 반영인지 어떻게 구분할 수 있는가?',
  ], missing);
  return sectionModel_(section, docs, symbol ? `${symbol}을 SSMK 렌즈로 보면 가격 변화, 점수, 사업 질문은 확인됐지만 실적/현금흐름 데이터 보강이 필요합니다.` : '깊게 볼 Top 종목 데이터가 아직 없습니다.', missing.join(', '), '');
}

function buildHypothesisLabSection_(section, context, topRows) {
  const rows = topRows.slice(0, context.hypothesis_count);
  const actual = rows.length > 0
    ? rows.map((row, index) => `가설 ${index + 1} ${row.ticker}: ${marketChangeTextForTicker_(context, row.ticker)}, 점수 ${roundTo2_(estimateScoreFromRow_(row))}, 근거 지표 ${clearMetricList_(row)}`)
    : ['핵심 가설 후보가 아직 없습니다.'];
  const hypothesisDetails = rows.map((row, index) => buildTeachingHypothesisCard_(context, row, index)).join('\n\n');
  const missing = rows.length < context.hypothesis_count ? [`핵심 가설 ${context.hypothesis_count}개 중 ${rows.length}개만 작성 가능`] : [];
  const docs = [
    learningFlowMarkdown_(section, actual, [
      '가설은 단순 질문이 아니라 데이터에서 출발한 임시 판단입니다. 핵심은 어떤 전제가 맞으면 추세가 이어지고, 어떤 전제가 깨지면 가설을 수정해야 하는지까지 쓰는 것입니다.',
    ], [
      '초보자는 가설을 세울 때 관찰된 사실, 해석, 예상, 반대 시나리오, 가설 수정 기준을 한 묶음으로 남겨야 합니다.',
    ], [
      '각 가설은 1주 뒤와 4주 뒤에 가격, 점수, 핵심 지표가 어느 방향으로 움직였는지로 복기합니다.',
    ], missing),
    '',
    hypothesisDetails || '가설 상세가 아직 없습니다.',
  ].join('\n');
  const model = sectionModel_(section, docs, `이번 주 핵심 가설 ${rows.length}개를 관찰된 사실, 근거, 레슨, 다음 확인으로 나눠 기록했습니다.`, missing.join(', '), '');
  model.content_blocks = rows.map((row, index) => teachingHypothesisContentBlock_(section, context, row, index));
  return model;
}

function forecastVsActualText_(context) {
  if (!context.hypothesis_reviews || context.hypothesis_reviews.length === 0) {
    return {
      actual: ['이번 발행일 기준으로 복기할 hypothesis_reviews 행이 아직 없습니다.'],
      missing: ['hypothesis_reviews'],
      summary: '아직 복기할 지난 가설이 없어 Forecast vs Actual은 다음 확인 항목으로 남깁니다.',
    };
  }
  const rows = context.hypothesis_reviews.slice(0, 5);
  const missingRows = rows.filter((row) => !row.actual_outcome && !row.outcome_data);
  const reviewedRows = rows.filter((row) => row.actual_outcome || row.outcome_data);
  const actualLines = reviewedRows.map((row) => {
    const symbol = row.ticker || '-';
    const windowText = row.review_window || '복기';
    const previous = row.previous_hypothesis || row.hypothesis_summary || '이전 가설';
    const expected = row.expected_outcome || '예상 결과 미입력';
    const actual = row.actual_outcome || row.outcome_data;
    const reason = row.change_reason || row.review_notes || '원인 지표를 추가로 분해해야 합니다';
    const result = row.result_label || '복기';
    return `${symbol} ${windowText}: 지난 가설은 "${previous}"였고 예상은 "${expected}"였습니다. 실제로는 ${actual}로 관측되어 결과는 ${result}입니다. 이는 ${reason}에 따른 결과로 볼 수 있으므로, 가설 수정은 "${previous}"에서 "${reason}가 확인될 때만 같은 방향의 추세를 인정한다"로 낮춰야 합니다.`;
  });
  if (missingRows.length > 0) {
    const missingNames = missingRows
      .map((row) => `${row.ticker || '-'} ${row.review_window || '복기'}`)
      .join(', ');
    actualLines.push(`${missingNames}: 복기 데이터 미입력. 이전 가설의 실제 진행 방향이 아직 비어 있어 이번 주에는 결론을 내리지 않습니다. 대신 다음 복기에서 가격, 점수, 핵심 지표가 어느 방향으로 움직였는지 채운 뒤 가설을 유지할지 낮출지 정합니다.`);
  }
  return {
    actual: actualLines,
    missing: missingRows.length > 0 ? [`복기 데이터 미입력 ${missingRows.length}건`] : [],
    summary: missingRows.length > 0
      ? `지난 가설 ${rows.length}개 중 ${missingRows.length}개는 실제 결과가 비어 있어 복기 품질 보강이 필요합니다.`
      : `지난 가설 ${rows.length}개를 실제 결과와 비교해 가설 수정 방향까지 기록했습니다.`,
  };
}

function buildForecastVsActualSection_(section, context) {
  const review = forecastVsActualText_(context);
  const docs = learningFlowMarkdown_(section, review.actual, [
    '이 리포트는 맞히는 문서가 아니라 맞고 틀린 이유를 배우는 기록입니다.',
  ], [
    '초보자는 예측이 틀렸을 때도 실패로만 보지 말고, 어떤 지표를 빼먹었는지 찾아야 합니다.',
  ], [
    '지난 가설에서 실제 결과와 가장 크게 달랐던 전제는 무엇인가?',
  ], review.missing);
  return sectionModel_(section, docs, review.summary, review.missing.join(', '), '');
}

function dividendEtfCornerText_(context) {
  const dividendRows = (context.watchlist || []).filter((row) => /배당|dividend|yes/i.test(`${row.investment_style || ''} ${row.theme_tags || ''} ${row.dividend_focus || ''}`));
  const etfRows = ['SPY', 'QQQ', 'SCHD', 'XLK', 'XLE']
    .map((ticker) => context.market_by_symbol && context.market_by_symbol[ticker])
    .filter(Boolean);
  const missing = [];
  if ((context.shareholder_returns || []).length === 0) missing.push('shareholder_returns');
  if ((context.etf_watch || []).length === 0) missing.push('etf_watch');
  if (etfRows.length === 0) missing.push('주요 ETF 가격 변화 데이터');

  return {
    actual: [
      `배당 성격 관찰 종목: ${dividendRows.slice(0, 8).map((row) => row.ticker).join(', ') || '미확인'}`,
      `주요 ETF 가격 변화: ${etfRows.map((row) => `${row.symbol}: ${formatPercentChange_(row.change_pct_1w) || '미확인'}`).join(', ') || '미수집'}`,
    ],
    missing: missing,
    summary: `배당/ETF 코너는 배당률을 결론으로 쓰지 않고, 배당 지속성·가격 변화·ETF 흐름을 분리해 봅니다.`,
  };
}

function buildDividendEtfCornerSection_(section, context) {
  const corner = dividendEtfCornerText_(context);
  const docs = learningFlowMarkdown_(section, corner.actual, [
    '배당률 상승은 배당금 증가 때문일 수도 있지만 주가 하락 때문일 수도 있습니다.',
    'ETF는 분산된 상품처럼 보이지만 상위 보유 종목 쏠림과 스타일 차이를 함께 봐야 합니다.',
  ], [
    '초보자는 배당과 ETF를 수익률 숫자 하나로 판단하지 않습니다. 숫자를 만든 원인을 알아야 배당이 안정성인지, 주가 하락의 그림자인지 구분할 수 있습니다.',
  ], [
    '배당주는 FCF와 배당성향으로 배당 지속성을 확인할 수 있는가?',
    'QQQ와 SCHD 흐름 차이가 이번 주 종목 관찰과 같은 방향인가?',
  ], corner.missing);
  return sectionModel_(section, docs, corner.summary, corner.missing.join(', '), '');
}

function buildHypothesisEvolutionLogSection_(section, context) {
  const rows = context.hypothesis_evolution_log || [];
  const missing = rows.length === 0 ? ['hypothesis_evolution_log'] : [];
  const actual = rows.length > 0
    ? rows.slice(0, 5).map((row) => `${row.hypothesis_id || '-'} ${row.hypothesis_version || ''}: ${row.previous_hypothesis || '이전 가설'} -> ${row.new_hypothesis || '새 가설'} (${row.change_reason || '변경 이유 미입력'})`)
    : ['이번 발행일 기준 가설 변경 이력이 아직 없습니다.'];
  const docs = learningFlowMarkdown_(section, actual, [
    '가설 진화는 내가 틀렸다는 기록이 아니라 다음 질문이 더 좋아졌다는 기록입니다.',
  ], [
    '초보자는 가설이 바뀐 이유를 남겨야 다음 리포트에서 같은 실수를 줄일 수 있습니다.',
  ], [
    '이번 주 새로 생긴 질문은 이전 질문보다 더 구체적인가?',
  ], missing);
  return sectionModel_(section, docs, rows.length > 0 ? `가설 변경 ${rows.length}건을 기록했습니다.` : '가설 변경 이력은 아직 없어 Docs 초안에 보강 필요로 남겼습니다.', missing.join(', '), '');
}

function buildLearningNotesSection_(section, context, topRows) {
  const row = topRows[0] || {};
  const lesson = row.ticker
    ? teachingBeginnerLessonForRow_(context, row)
    : '이번 주에는 가격 변화와 점수 변화가 어떤 사업 지표를 예상하는지 분리해서 읽는 연습이 핵심입니다.';
  const actual = row.ticker
    ? [`대표 사례: ${compactRowName_(row)} / ${marketChangeTextForTicker_(context, row.ticker)} / 레슨 ${lesson}`]
    : ['대표 학습 사례가 아직 없습니다.'];
  const missing = row.ticker ? [] : ['weekly_scores'];
  const docs = learningFlowMarkdown_(section, actual, [
    '이번 주 레슨은 추상적인 조언이 아니라 실제 가격 변화와 점수 변화에서 출발해야 합니다.',
  ], [
    lesson,
  ], [
    '다음 주에는 가격 변화가 예상한 사업 지표 개선과 같은 방향으로 확인되는가?',
  ], missing);
  return sectionModel_(section, docs, lesson, missing.join(', '), '');
}

function buildSourcesLimitationsSection_(section, context) {
  const missing = [];
  if ((context.news_events || []).length === 0) missing.push('news_events');
  if ((context.company_fundamentals || []).length === 0) missing.push('company_fundamentals');
  if ((context.shareholder_returns || []).length === 0) missing.push('shareholder_returns');
  if ((context.etf_watch || []).length === 0) missing.push('etf_watch');
  const actual = [
    `이번 리포트에 사용한 자료: 관찰 점수 데이터 ${context.weekly_scores.length}개, 가격 변화 데이터 ${context.market_data.length}개, 뉴스 이벤트 ${context.news_events.length}개`,
    `출처 확인 기록: 출처 확인 기록 ${context.source_policy.length}개, 출처 목록 ${context.data_sources.length}개`,
  ];
  const docs = learningFlowMarkdown_(section, actual, [
    '데이터가 부족하면 판단을 강하게 쓰지 않고 어떤 데이터가 필요한지 밝히는 것이 더 좋은 리포트입니다.',
  ], [
    '초보자는 모르는 것을 모른다고 쓰는 습관이 투자 공부의 안전장치라는 점을 배워야 합니다.',
  ], [
    '다음 자동화 단계에서 먼저 채워야 할 데이터는 뉴스, 실적, 배당, ETF 중 무엇인가?',
  ], missing);
  return sectionModel_(section, docs, `이번 리포트는 가격/점수 중심 1차 데이터로 만들었고, 부족한 데이터는 ${missing.join(', ') || '큰 누락 없음'}입니다.`, missing.join(', '), '');
}

function buildAgentReviewBoardSection_(section, context) {
  const agentRows = context.agent_review_log || [];
  const qaRows = context.qa_review_log || [];
  const actual = [
    `agent_review_log ${agentRows.length}개, qa_review_log ${qaRows.length}개를 편집자용으로 확인합니다.`,
    agentRows.length > 0 ? agentRows.slice(0, 5).map((row) => `${row.agent_name || '-'}: ${row.status || '-'} ${row.finding_summary || ''}`).join(' / ') : '아직 에이전트 리뷰 행이 없습니다.',
  ];
  const missing = agentRows.length === 0 ? ['agent_review_log'] : [];
  const docs = learningFlowMarkdown_(section, actual, [
    '운영 검토 내용은 Docs 초안과 대시보드에서 확인하고, 독자용 이메일에는 넣지 않습니다.',
  ], [
    '초보자가 읽는 본문과 운영자가 보는 품질 메모를 분리해야 리포트가 학습 콘텐츠로 유지됩니다.',
  ], [
    '차단 항목이 있으면 사용자 확인 후 수정했는가?',
  ], missing);
  return sectionModel_(section, docs, '운영 검토는 Docs 초안에서만 확인합니다.', missing.join(', '), '');
}

function buildGenericReportSection_(section, context) {
  const docs = learningFlowMarkdown_(section, [
    `${section.section_title} 섹션은 report_blueprint에는 있으나 전용 빌더가 아직 없습니다.`,
  ], [
    '전용 빌더가 없으므로 이 섹션은 편집자 검토가 필요합니다.',
  ], [
    section.beginner_purpose || '초보자용 학습 목적을 더 구체화해야 합니다.',
  ], [
    '이 섹션에 필요한 실제 데이터와 다음 확인 질문은 무엇인가?',
  ], ['전용 section builder']);
  return sectionModel_(section, docs, `${section.section_title} 섹션은 전용 빌더 보강이 필요합니다.`, '전용 section builder', '');
}

function buildWeeklyLabReportSectionModels_(context) {
  const topRows = topScoreRows_(context, context.top_n);
  return (context.blueprint_sections || [])
    .filter((section) => section.enabled)
    .map((section) => {
      switch (section.section_key) {
        case 'executive_dashboard':
          return buildExecutiveDashboardSection_(section, context, topRows);
        case 'market_map':
          return buildMarketMapSection_(section, context);
        case 'industry_theme_board':
          return buildIndustryThemeBoardSection_(section, context, topRows);
        case 'stock_dashboard':
          return buildStockDashboardSection_(section, context, topRows);
        case 'lens_deep_dive':
          return buildLensDeepDiveSection_(section, context, topRows);
        case 'hypothesis_lab':
          return buildHypothesisLabSection_(section, context, topScoreRows_(context, context.hypothesis_count));
        case 'forecast_vs_actual':
          return buildForecastVsActualSection_(section, context);
        case 'dividend_etf_corner':
          return buildDividendEtfCornerSection_(section, context);
        case 'hypothesis_evolution_log':
          return buildHypothesisEvolutionLogSection_(section, context);
        case 'learning_notes':
          return buildLearningNotesSection_(section, context, topRows);
        case 'sources_limitations':
          return buildSourcesLimitationsSection_(section, context);
        case 'agent_review_board':
          return buildAgentReviewBoardSection_(section, context);
        default:
          return buildGenericReportSection_(section, context);
      }
    });
}

const WEEKLY_LAB_FORBIDDEN_REPORT_PATTERNS = [
  ['를 통해 관찰 우선순위', '를 확인합니다.'].join(''),
  ['이번 주 데이터가 실제 사업 흐름과 연결되는지', ' 확인합니다.'].join(''),
  ['초보자는 점수 자체보다 지표와 사업 질문의 연결을', ' 보는 연습을 합니다.'].join(''),
  '확인하는 학습 질문으로 남깁니다',
  '살피는 방식으로 시작합니다',
  '가설 요약 보강 필요',
  '해석 보강 필요',
  '레슨 보강 필요',
  '아직 모름 / 실제 결과 미입력',
  '매수 추천',
  '매도 추천',
  '지금 사',
  '사야 할',
  '수익 보장',
];

const WEEKLY_LAB_VAGUE_INSIGHT_PATTERNS = [
  ['VAGUE_CONFIRM_SHOULD', /확인해야\s*(합니다|한다|됩니다|된다)/],
  ['VAGUE_ATTENTION', /주목해야\s*(합니다|한다|됩니다|된다)/],
  ['VAGUE_LOOK_NEEDED', /살펴볼\s*필요가\s*있습니다/],
  ['VAGUE_QUESTION_REMAINS', /질문으로\s*남(깁니다|긴다|겨둡니다)/],
  ['VAGUE_PRACTICE_NEEDED', /보는\s*연습이\s*필요합니다/],
  ['VAGUE_START_LANGUAGE', /방식으로\s*시작합니다/],
];

const WEEKLY_LAB_EMAIL_OPERATION_PATTERNS = [
  'QA 상태',
  'blocked',
  'error_log',
  'bottleneck_log',
  '발행 전 체크리스트',
  '로그를 확인',
];

const PUBLISH_QC_REQUIRED_HTML_MARKERS = [
  '실제 변화',
  '해석',
  '초보자 레슨',
  '다음 확인 질문',
  '이번 주 관찰 가설',
  '데이터 신뢰도 확인',
  '한 줄 가설',
  '근거 지표',
  '반대 시나리오',
  '가설 수정 기준',
  '다음 검증 데이터',
  '배당과 ETF',
  '지난 가설 복기',
];

const PUBLISH_QC_HARD_BLOCK_PATTERNS = [
  'QA 상태',
  'blocked',
  'error_log',
  'bottleneck_log',
  '발행 전 체크리스트',
  'Executive Dashboard',
  'Market Map',
  'Hypothesis Lab',
  'Dividend & ETF Corner',
  'Forecast vs Actual',
];

function vagueInsightMatches_(text) {
  const source = String(text || '');
  return WEEKLY_LAB_VAGUE_INSIGHT_PATTERNS
    .filter((item) => item[1].test(source))
    .map((item) => item[0]);
}

function runWeeklyLabReportQualityGate_(context, sectionModels, outputDrafts) {
  const models = sectionModels || [];
  const docsText = models.map((model) => model.docs_markdown || '').join('\n');
  const emailText = outputDrafts && outputDrafts.email_html
    ? outputDrafts.email_html
    : models.filter((model) => model.email_output).map((model) => model.email_html_summary || '').join('\n');
  const modelKeys = new Set(models.map((model) => model.section_key));
  const blockingIssues = [];
  const warnings = [];

  (context.blueprint_sections || [])
    .filter((section) => section.required && section.enabled !== false)
    .forEach((section) => {
      if (!modelKeys.has(section.section_key)) {
        blockingIssues.push(`필수 섹션 누락: ${section.section_key}`);
      }
    });

  WEEKLY_LAB_FORBIDDEN_REPORT_PATTERNS.forEach((pattern) => {
    if (docsText.indexOf(pattern) !== -1) {
      blockingIssues.push(`금지 문장 패턴 포함: ${pattern}`);
    }
  });

  vagueInsightMatches_(`${docsText}\n${emailText}`).forEach((label) => {
    blockingIssues.push(`회피형 인사이트 문장 포함: ${label}`);
  });

  WEEKLY_LAB_EMAIL_OPERATION_PATTERNS.forEach((pattern) => {
    if (emailText.indexOf(pattern) !== -1) {
      blockingIssues.push(`이메일 HTML 운영 문구 포함: ${pattern}`);
    }
  });

  models.forEach((model) => {
    if (model.required && String(model.docs_markdown || '').trim().length < 40) {
      warnings.push(`필수 섹션 본문이 짧음: ${model.section_key}`);
    }
    if (model.missing_data) {
      warnings.push(`데이터 한계 표시됨: ${model.section_key} - ${model.missing_data}`);
    }
  });

  return {
    status: blockingIssues.length > 0 ? 'blocked' : (warnings.length > 0 ? 'warning' : 'pass'),
    blocking_count: blockingIssues.length,
    warning_count: warnings.length,
    blocking_issues: blockingIssues,
    warnings: warnings,
    summary: blockingIssues.concat(warnings).join(' / '),
  };
}

function publishRecommendationRisk_(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const safeAntiRecommendationPatterns = [
    /매수\s*근거가\s*되는\s*것은\s*아닙니다/,
    /매수\s*근거가\s*아닙니다/,
    /매수\/매도처럼\s*읽히는\s*표현이\s*없는지\s*확인/,
    /투자\s*권유가\s*아니라/,
    /투자\s*판단처럼\s*읽히지\s*않도록/,
  ];
  const normalized = safeAntiRecommendationPatterns.reduce((source, pattern) => source.replace(pattern, ''), text);
  const riskPatterns = [
    /지금\s*사도\s*좋/,
    /사야\s*할/,
    /매수\s*추천/,
    /매도\s*추천/,
    /추천\s*(종목|대상|타이밍|매수|매도)/,
    /확실한?\s*기회/,
    /수익\s*(기회|보장|확정|가능)/,
    /투자\s*추천/,
  ];
  const matched = riskPatterns.find((pattern) => pattern.test(normalized));
  return matched ? matched.toString() : '';
}

function publishForecastReviewMissing_(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return /복기\s*데이터\s*미입력|아직\s*복기할\s*지난\s*가설|실제\s*결과를\s*기록하지\s*못했습니다/.test(text);
}

function publishEtfDataMissing_(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return /주요\s*ETF\s*가격\s*변화:\s*미수집|주요\s*ETF\s*market_data|ETF\s*데이터\s*미수집|ETF\s*흐름을\s*가격\s*변화로\s*확인하지\s*못했습니다/.test(text);
}

function runPublishQualityGate_(input) {
  const html = String(input && input.html || '');
  const blockingIssues = [];
  const warnings = [];
  const recommendationRisk = publishRecommendationRisk_(html);
  if (recommendationRisk) {
    blockingIssues.push(`BLOCK_RECOMMENDATION_RISK_추천: ${recommendationRisk}`);
  }

  PUBLISH_QC_HARD_BLOCK_PATTERNS.forEach((pattern) => {
    if (html.indexOf(pattern) === -1) return;
    blockingIssues.push(`BLOCK_FORBIDDEN_PATTERN: ${pattern}`);
  });

  vagueInsightMatches_(html).forEach((label) => {
    blockingIssues.push(`BLOCK_VAGUE_INSIGHT: ${label}`);
  });

  PUBLISH_QC_REQUIRED_HTML_MARKERS.forEach((marker) => {
    if (html.indexOf(marker) === -1) {
      blockingIssues.push(`BLOCK_REQUIRED_MARKER_MISSING: ${marker}`);
    }
  });

  const missingForecastReview = publishForecastReviewMissing_(html);
  if (missingForecastReview) {
    warnings.push('WARN_FORECAST_REVIEW_MISSING: Forecast vs Actual 복기 데이터가 비어 있어 실제 학습 복기가 약합니다.');
  }
  const missingEtfData = publishEtfDataMissing_(html);
  if (missingEtfData) {
    warnings.push('WARN_ETF_DATA_MISSING: Dividend & ETF Corner의 주요 ETF 가격 데이터가 비어 있어 성장주/배당주 비교 학습이 약합니다.');
  }

  const scoreBreakdown = {
    source_alignment: html.indexOf('MSFT') !== -1 || html.indexOf('QQQ') !== -1 || html.indexOf('SCHD') !== -1 ? 24 : 15,
    required_structure: blockingIssues.some((issue) => issue.indexOf('REQUIRED_MARKER') !== -1) ? 5 : 15,
    learning_flow: ['실제 변화', '해석', '초보자 레슨', '다음 확인 질문'].every((marker) => html.indexOf(marker) !== -1) ? 20 : 8,
    recommendation_safety: blockingIssues.some((issue) => /매수|매도|추천|지금 사|수익 보장/.test(issue)) ? 0 : 20,
    data_limits: html.indexOf('확인되지 않았습니다') !== -1 || html.indexOf('부족한 데이터') !== -1 ? 10 : 7,
    forecast_review: missingForecastReview ? 0 : 10,
    dividend_etf_data: missingEtfData ? 0 : 10,
    html_separation: blockingIssues.some((issue) => /QA 상태|blocked|error_log|bottleneck_log|체크리스트/.test(issue)) ? 0 : 5,
  };
  const finalScore = Object.keys(scoreBreakdown).reduce((sum, key) => sum + scoreBreakdown[key], 0);
  const status = blockingIssues.length > 0 || finalScore < 70
    ? 'blocked'
    : finalScore >= 85
      ? (warnings.length > 0 ? 'warning' : 'pass')
      : 'warning';

  return {
    status: status,
    final_qc_score: finalScore,
    score_breakdown: scoreBreakdown,
    blocking_count: blockingIssues.length,
    warning_count: warnings.length,
    blocking_issues: blockingIssues,
    warnings: warnings,
    summary: blockingIssues.concat(warnings).join(' / '),
  };
}

function canSendReportWithPublishQc_(report, latestQc) {
  const latestStatus = latestQc ? String(latestQc.status || latestQc.overall_status || '').trim() : '';
  if (!latestQc) {
    return { ok: false, reason: '최신 세이지 Publish QC 결과가 없습니다.' };
  }
  if (latestStatus === 'blocked') {
    return { ok: false, reason: '세이지 Publish QC가 blocked입니다.' };
  }
  if (['pass', 'warning'].indexOf(latestStatus) === -1) {
    return { ok: false, reason: '세이지 Publish QC 상태를 확인할 수 없습니다.' };
  }
  if (!report || String(report.generation_status || '') !== '승인') {
    return { ok: false, reason: '리포트가 승인 상태가 아닙니다.' };
  }
  return { ok: true, reason: '발송 가능' };
}

function recordWeeklyLabQualityGateReview_(context, reportId, qualityResult) {
  appendObject_(SSMK.sheets.agentReviewLog, SSMK.headers.agentReviewLog, {
    review_id: `AR-${compactDate_(context.issue_date)}-${String(new Date().getTime()).slice(-6)}-QG`,
    issue_date: context.issue_date,
    agent_name: 'QA Gate',
    agent_role: '구조/문장/출력 분리 검증',
    review_target: `report-${reportId}`,
    status: qualityResult.status === 'blocked' ? 'block' : (qualityResult.status === 'warning' ? 'warning' : 'pass'),
    finding_summary: qualityResult.summary || '필수 구조와 출력 분리 검사 통과',
    risk_level: qualityResult.status === 'blocked' ? 'high' : (qualityResult.status === 'warning' ? 'medium' : 'low'),
    required_action: qualityResult.status === 'blocked' ? '차단 항목 수정 후 재생성' : '부족한 데이터가 본문에 한계로 표시됐는지 확인',
    blocking: qualityResult.status === 'blocked' ? 'TRUE' : 'FALSE',
    resolved: 'FALSE',
    resolved_at: '',
    notes: '자동 리포트 빌더 품질 게이트',
    run_id: context.run_id,
    report_id: reportId,
  });
}

function recordPublishQualityGateReview_(context, reportId, htmlVersionId, qualityResult) {
  const safeContext = context || {};
  const safeResult = qualityResult || {};
  const scoreBreakdown = safeResult.score_breakdown || {};
  const qaId = `QA-${compactDate_(today_())}-${compactTime_()}-${String(new Date().getTime()).slice(-3)}-SAGE`;

  appendObject_(SSMK.sheets.qaReviewLog, SSMK.headers.qaReviewLog, {
    qa_id: qaId,
    run_id: safeContext.run_id || '',
    review_date: today_(),
    overall_status: safeResult.status || 'blocked',
    content_quality_score: safeResult.final_qc_score || 0,
    data_quality_score: scoreBreakdown.source_alignment || '',
    visualization_quality_score: '',
    process_efficiency_score: '',
    main_issues: safeResult.summary || '세이지 Publish QC 통과',
    recommended_next_action: safeResult.status === 'blocked' ? '차단 항목 수정 후 HTML 재생성' : '사용자 검토 후 승인 가능',
    automation_change_needed: safeResult.status === 'blocked' ? 'TRUE' : 'FALSE',
    report_id: reportId,
    html_version_id: htmlVersionId || '',
    source_snapshot_id: safeContext.source_snapshot_id || safeContext.snapshot_id || '',
    checked_by: '세이지',
    blocked_count: safeResult.blocking_count || 0,
    warning_count: safeResult.warning_count || 0,
    qc_score_breakdown: JSON.stringify(scoreBreakdown),
  });

  updateReportRunStatus_(
    reportId,
    safeResult.status === 'blocked' ? '사용자 확인 필요' : '초안 생성',
    `sage_qc_status=${safeResult.status || 'blocked'}; score=${safeResult.final_qc_score || 0}; qa_id=${qaId}; html_version=${htmlVersionId || ''}`
  );
  return qaId;
}

function getLatestPublishQualityGateReview_(reportId) {
  const normalizedReportId = String(reportId || '').trim();
  if (!normalizedReportId) return null;

  const rows = readObjects_(SSMK.sheets.qaReviewLog)
    .filter((row) => String(row.report_id || '').trim() === normalizedReportId)
    .filter((row) => String(row.checked_by || '').trim() === '세이지')
    .sort((a, b) => {
      const left = `${String(a.review_date || '')} ${String(a.qa_id || '')}`;
      const right = `${String(b.review_date || '')} ${String(b.qa_id || '')}`;
      return left.localeCompare(right);
    });
  const latest = rows.pop() || null;
  if (!latest) return null;

  return Object.assign({}, latest, {
    status: latest.status || latest.overall_status || '',
    final_qc_score: Number(latest.final_qc_score || latest.content_quality_score || 0),
  });
}

function renderWeeklyLabDocsDraft_(context, sectionModels, qualityResult) {
  const sectionText = sectionModels
    .filter((model) => model.docs_output)
    .sort((a, b) => a.section_order - b.section_order)
    .map((model) => model.docs_markdown)
    .join('\n\n---\n\n');
  const qualityText = [
    '## 편집자용 QA 메모',
    '',
    `- QA Gate 상태: ${qualityResult.status}`,
    `- 차단 항목: ${qualityResult.blocking_issues.length ? qualityResult.blocking_issues.join(' / ') : '없음'}`,
    `- 경고 항목: ${qualityResult.warnings.length ? qualityResult.warnings.join(' / ') : '없음'}`,
    '',
    '## 발행 전 체크리스트',
    '',
    '- [ ] 추천/매수/매도처럼 읽히는 표현이 없는지 확인',
    '- [ ] 데이터가 부족한 항목이 사실처럼 쓰이지 않았는지 확인',
    '- [ ] 이메일 HTML에는 운영 로그와 QA 문구가 빠져 있는지 확인',
  ].join('\n');

  return [
    `SSMK Weekly Lab 초안 보고서 - ${context.issue_date}`,
    '',
    `run_id: ${context.run_id}`,
    `generated_at: ${context.generated_at}`,
    '',
    SSMK.disclaimer,
    '',
    sectionText,
    '',
    qualityText,
    '',
    '이 문서는 편집자용 초안입니다. 이메일은 자동 발송하지 않았습니다.',
  ].join('\n');
}

function renderContentBlockHtml_(block) {
  const learnerBlock = enrichContentBlockForLearning_(block || {});
  const parts = [
    `<p style="font-size:12px;line-height:1.35;margin:0 0 14px;color:#4e4d4d;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(learnerBlock.reader_question || '')}</p>`,
    learnerBlock.detail_title ? `<p style="font-size:15px;line-height:1.35;margin:0 0 14px;font-weight:700;color:#000000;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(learnerBlock.detail_title)}</p>` : '',
    learningLadderHtml_(learnerBlock),
    '<div style="display:grid;gap:14px;">',
    learnerHtmlBlock_('실제 변화', learnerBlock.actual_change),
    learnerBlock.data_reliability_note ? learnerHtmlBlock_('데이터 신뢰도 확인', learnerBlock.data_reliability_note) : '',
    learnerHtmlBlock_('해석', learnerBlock.interpretation),
    learnerBlock.one_line_hypothesis ? learnerHtmlBlock_('한 줄 가설', learnerBlock.one_line_hypothesis) : '',
    learnerBlock.evidence_metrics ? learnerHtmlBlock_('근거 지표', learnerBlock.evidence_metrics) : '',
    learnerHtmlBlock_('초보자 레슨', learnerBlock.beginner_lesson),
    learnerBlock.counter_scenario ? learnerHtmlBlock_('반대 시나리오', learnerBlock.counter_scenario) : '',
    !learnerBlock.counter_scenario && learnerBlock.counter_question ? learnerHtmlBlock_('반대 시나리오', learnerBlock.counter_question) : '',
    learnerBlock.revision_rule ? learnerHtmlBlock_('가설 수정 기준', learnerBlock.revision_rule) : '',
    learnerBlock.next_validation_data ? learnerHtmlBlock_('다음 검증 데이터', learnerBlock.next_validation_data) : '',
    learnerHtmlBlock_('다음 확인 질문', learnerBlock.next_check),
    learnerBlock.missing_data_note ? learnerHtmlBlock_('현재 한계', learnerBlock.missing_data_note) : '',
    '</div>',
  ];
  return parts.filter(Boolean).join('');
}

function shortLearnerText_(text, fallback) {
  const cleaned = cleanLearnerFacingText_(text || fallback || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (/SPY:\s*가격 변화 데이터 미수집.*QQQ:\s*가격 변화 데이터 미수집/.test(cleaned)) {
    return '주요 ETF 가격 데이터가 비어 있어 이번 주 시장 선호는 판단 보류입니다.';
  }
  if (/좋은 회사.*좋은 산업.*좋은 가격/.test(cleaned)) {
    return '좋은 회사인지와 지금 가격이 좋은지는 따로 판단합니다.';
  }
  if (/초보자는 숫자 하나를 외우기보다/.test(cleaned)) {
    return '숫자 하나보다 숫자가 가리키는 원인을 봅니다.';
  }
  if (cleaned.length <= 74) return cleaned;
  return `${cleaned.slice(0, 72).replace(/[,\s]+$/g, '')}...`;
}

function learningLadderHtml_(block) {
  const steps = [
    { label: '숫자', text: shortLearnerText_(block.actual_change, '이번 주 실제로 확인된 변화를 먼저 봅니다.') },
    { label: '의미', text: shortLearnerText_(block.interpretation || block.one_line_hypothesis, '그 숫자가 어떤 시장 기대를 뜻하는지 바꿔 읽습니다.') },
    { label: '레슨', text: shortLearnerText_(block.beginner_lesson, '결론보다 관찰 습관을 남깁니다.') },
    { label: '다음 확인', text: shortLearnerText_(block.next_check || block.next_validation_data, '다음 주에 확인할 데이터를 정합니다.') },
  ];
  return [
    '<div data-ssmk="learning-ladder" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:0 0 14px;">',
    steps.map((step) => [
      '<div style="border:1px solid #242424;border-radius:18px;background:#ffffff;padding:10px;min-height:76px;">',
      `<p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#242424;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(step.label)}</p>`,
      `<p style="margin:0;font-size:12px;line-height:1.45;color:#4e4d4d;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(step.text)}</p>`,
      '</div>',
    ].join('')).join(''),
    '</div>',
  ].join('');
}

function uniqueMetricItems_(items, limit) {
  const seen = {};
  const output = [];
  (items || []).forEach((item) => {
    const cleaned = replaceInternalSourceNames_(String(item || ''))
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^,\s*/, '')
      .replace(/\s+:/g, ':');
    if (!cleaned || cleaned.length > 80 || /개와\s/.test(cleaned) || seen[cleaned]) return;
    seen[cleaned] = true;
    output.push(cleaned);
  });
  return output.slice(0, limit || 12);
}

function distributionItemsFromText_(text) {
  const source = String(text || '');
  const items = [];
  [
    '산업 분포',
    '투자 성격 분포',
  ].forEach((label) => {
    const pattern = new RegExp(`${label}\\s*:\\s*([\\s\\S]*?)(?=\\s+(?:산업 분포|투자 성격 분포|테마 키워드 예시|이번 리포트에 사용한 자료|출처 확인 기록)\\s*:|$)`);
    const match = source.match(pattern);
    if (!match) return;
    String(match[1] || '')
      .split(',')
      .map((part) => part.trim())
      .filter((part) => /\d+개/.test(part))
      .forEach((part) => items.push(`${label}: ${part}`));
  });
  return items;
}

function etfStatusItemsFromText_(text) {
  const source = String(text || '');
  const items = [];
  const pattern = /\b(SPY|QQQ|SCHD|XLK|XLE):\s*([\s\S]*?)(?=\s+(?:SPY|QQQ|SCHD|XLK|XLE):|$)/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    const value = String(match[2] || '').replace(/\s+/g, ' ').trim();
    if (value) items.push(`${match[1]}: ${value}`);
  }
  return items;
}

function metricItemsFromText_(text) {
  const source = String(text || '');
  const items = [];
  const patterns = [
    /(?:관찰 점수 데이터|가격 변화 데이터|뉴스 이벤트|출처 확인 기록|출처 목록|산업\/테마 점수|기업 기초지표|주주환원 데이터|ETF 관찰 데이터|가설 기록|지난 가설 복기|품질 점검 기록)\s*\d+개?/g,
    /\b(?:weekly_scores|market_data|news_events|source_policy|data_sources|sector_theme_scores|company_fundamentals|shareholder_returns|etf_watch|hypothesis_lab|hypothesis_reviews|qa_review_log)\s*\d+개?/g,
    /\b[A-Z]{1,5}\s*:?\s*[+-]?\d+(?:\.\d+)?%/g,
    /\b[A-Z]{1,5}(?:\([^)]+\))?\s*관찰점수\s*\d+(?:\.\d+)?\b/g,
    /\b[A-Z]{1,5}\s+\d+(?:\.\d+)?\b/g,
    /등급\s*[가-힣A-Za-z0-9+-]+/g,
  ];
  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(source)) !== null) {
      items.push(match[0]);
    }
  });
  distributionItemsFromText_(source).forEach((item) => items.push(item));
  etfStatusItemsFromText_(source).forEach((item) => items.push(item));
  return uniqueMetricItems_(items, 14);
}

function percentRowsFromText_(text) {
  const source = String(text || '');
  const rows = [];
  const pattern = /\b([A-Z]{1,5})[^,\n.;]*?([+-]\d+(?:\.\d+)?)%/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    rows.push({
      label: match[1],
      value: Number(match[2]),
      text: `${match[1]} ${match[2]}%`,
    });
  }
  return uniqueMetricItems_(rows.map((row) => `${row.label}|${row.value}|${row.text}`), 8)
    .map((item) => {
      const parts = item.split('|');
      return { label: parts[0], value: Number(parts[1]), text: parts[2] };
    })
    .filter((row) => !Number.isNaN(row.value));
}

function metricChipHtml_(text) {
  const items = metricItemsFromText_(text);
  if (items.length === 0) return '';
  return [
    '<div data-ssmk="metric-chip-row" style="display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px;">',
    items.map((item) => `<span data-ssmk="metric-chip" style="display:inline-block;border:1px solid #242424;border-radius:2000px;padding:6px 10px;font-size:12px;line-height:1.2;color:#242424;background:#f6f3f1;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(item)}</span>`).join(''),
    '</div>',
  ].join('');
}

function miniBarHtml_(text) {
  const rows = percentRowsFromText_(text);
  if (rows.length === 0) return '';
  const maxAbs = rows.reduce((max, row) => Math.max(max, Math.abs(row.value)), 1);
  const rowHtml = rows.map((row) => {
    const width = Math.max(8, Math.round((Math.abs(row.value) / maxAbs) * 100));
    const color = row.value >= 0 ? '#242424' : '#797776';
    const direction = row.value >= 0 ? '상승' : '하락';
    return [
      '<div style="display:grid;grid-template-columns:64px 1fr 58px;gap:8px;align-items:center;margin:6px 0;">',
      `<span style="font-size:12px;color:#242424;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(row.label)}</span>`,
      '<span style="display:block;background:#f6f3f1;border:1px solid #d8d2cd;border-radius:2000px;height:10px;overflow:hidden;">',
      `<span data-ssmk="mini-bar" title="${escapeHtml_(direction)}" style="display:block;width:${width}%;height:10px;background:${color};border-radius:2000px;"></span>`,
      '</span>',
      `<span style="font-size:12px;color:#242424;text-align:right;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(formatPercentChange_(row.value))}</span>`,
      '</div>',
    ].join('');
  }).join('');
  return [
    '<div style="background:#cfdaf5;border:1px solid #242424;border-radius:24px;padding:12px;margin:0 0 12px;">',
    '<p style="margin:0 0 6px;font-size:11px;letter-spacing:0.05px;color:#242424;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">MINI CHART</p>',
    rowHtml,
    '</div>',
  ].join('');
}

function learnerParagraphText_(label, text, hasVisuals) {
  const source = cleanLearnerFacingText_(text);
  const isDataSummary = /관찰 점수 데이터|가격 변화 데이터|뉴스 이벤트|출처 확인 기록|출처 목록|품질 점검 기록|산업 분포|투자 성격 분포|테마 키워드|배당 성격 관찰 종목|주요 ETF 가격 변화|SPY:|QQQ:|SCHD:|XLK:|XLE:/.test(source);
  if (hasVisuals && isDataSummary && label === '실제 변화') {
    return `${source} 읽는 법: 위 숫자들은 이번 주 관찰 질문을 만들기 위한 재료입니다. 개수와 변화율을 먼저 나눠 보면, 어떤 데이터는 충분하고 어떤 데이터는 아직 비어 있는지 더 쉽게 확인할 수 있습니다.`;
  }
  return source;
}

function learnerHtmlBlock_(label, text) {
  const source = String(text || '이번 자동 수집에서는 아직 확인되지 않았습니다.');
  const visualHtml = [
    metricChipHtml_(source),
    miniBarHtml_(source),
  ].join('');
  const displayText = learnerParagraphText_(label, source, Boolean(visualHtml));
  return [
    '<div style="border:1px solid #242424;border-radius:32px;padding:18px;background:#ffffff;box-shadow:rgba(0,0,0,0.05) 0 0 10px 0;">',
    `<p style="display:inline-block;margin:0 0 10px;border:1px solid #242424;border-radius:2000px;padding:5px 10px;font-size:12px;font-weight:700;letter-spacing:0.05px;color:#242424;background:#f6f3f1;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(label)}</p>`,
    visualHtml,
    `<p style="margin:0;font-size:14px;line-height:1.75;color:#242424;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(displayText)}</p>`,
    '</div>',
  ].join('');
}

function etfRoleLabel_(ticker) {
  const roles = {
    SPY: '미국 전체 시장',
    QQQ: '성장 기대',
    SCHD: '배당 안정성',
    XLK: '기술주 온도',
    XLE: '에너지 온도',
  };
  return roles[String(ticker || '').toUpperCase()] || '시장 흐름';
}

function etfTemperatureRowsFromBlocks_(blocks) {
  const source = (blocks || []).map((block) => [
    block.actual_change,
    block.interpretation,
    block.next_check,
  ].join(' ')).join(' ');
  const rowMap = {};
  percentRowsFromText_(source).forEach((row) => {
    if (!/^(SPY|QQQ|SCHD|XLK|XLE)$/.test(row.label)) return;
    rowMap[row.label] = row;
  });
  ['SPY', 'QQQ', 'SCHD', 'XLK', 'XLE'].forEach((ticker) => {
    if (!rowMap[ticker]) rowMap[ticker] = { label: ticker, value: null, text: '미수집' };
  });
  return ['SPY', 'QQQ', 'SCHD', 'XLK', 'XLE'].map((ticker) => rowMap[ticker]);
}

function marketTemperatureHtml_(blocks) {
  const rows = etfTemperatureRowsFromBlocks_(blocks);
  const numericRows = rows.filter((row) => typeof row.value === 'number' && !Number.isNaN(row.value));
  if (numericRows.length === 0) {
    return [
      '<div data-ssmk="market-temperature" style="border:1px solid #242424;border-radius:28px;background:#ffffff;padding:16px;margin:0 0 16px;">',
      '<p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#242424;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">시장 온도계</p>',
      '<p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#4e4d4d;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">ETF 가격 데이터가 아직 비어 있습니다. 그래서 이번 주에는 QQQ가 강한지, SCHD가 강한지, 기술주와 에너지가 어느 쪽으로 움직였는지 확정하지 않습니다.</p>',
      '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;">',
      '<div style="border:1px solid #d8d2cd;border-radius:18px;background:#f6f3f1;padding:10px;"><strong style="display:block;margin:0 0 6px;font-size:12px;color:#242424;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">읽는 법</strong><p style="margin:0;font-size:12px;line-height:1.5;color:#4e4d4d;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">빈 차트를 결론처럼 읽지 않습니다. 데이터가 없으면 판단을 낮춥니다.</p></div>',
      '<div style="border:1px solid #d8d2cd;border-radius:18px;background:#f6f3f1;padding:10px;"><strong style="display:block;margin:0 0 6px;font-size:12px;color:#242424;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">다음 실행</strong><p style="margin:0;font-size:12px;line-height:1.5;color:#4e4d4d;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">SPY, QQQ, SCHD, XLK, XLE 가격 변화가 채워지는지 확인합니다.</p></div>',
      '<div style="border:1px solid #d8d2cd;border-radius:18px;background:#f6f3f1;padding:10px;"><strong style="display:block;margin:0 0 6px;font-size:12px;color:#242424;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">초보자 레슨</strong><p style="margin:0;font-size:12px;line-height:1.5;color:#4e4d4d;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">좋은 리포트는 모르는 것을 숨기지 않고 무엇이 더 필요한지 알려줍니다.</p></div>',
      '</div>',
      '</div>',
    ].join('');
  }
  const maxAbs = numericRows.reduce((max, row) => Math.max(max, Math.abs(row.value)), 1);
  return [
    '<div data-ssmk="market-temperature" style="border:1px solid #242424;border-radius:28px;background:#ffffff;padding:16px;margin:0 0 16px;">',
    '<p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#242424;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">시장 온도계</p>',
    '<p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#4e4d4d;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">개별 종목을 보기 전에 ETF 5개로 시장 바람을 먼저 봅니다. QQQ는 성장 기대, SCHD는 배당 안정성, XLK는 기술주, XLE는 에너지 온도를 보여주는 기준점입니다.</p>',
    rows.map((row) => {
      const hasValue = typeof row.value === 'number' && !Number.isNaN(row.value);
      const width = hasValue ? Math.max(8, Math.round((Math.abs(row.value) / maxAbs) * 100)) : 8;
      const valueText = hasValue ? formatPercentChange_(row.value) : '미수집';
      const color = !hasValue ? '#d8d2cd' : (row.value >= 0 ? '#242424' : '#797776');
      return [
        '<div style="display:grid;grid-template-columns:58px 88px 1fr 58px;gap:8px;align-items:center;margin:8px 0;">',
        `<strong style="font-size:13px;color:#000000;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(row.label)}</strong>`,
        `<span style="font-size:12px;color:#4e4d4d;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(etfRoleLabel_(row.label))}</span>`,
        '<span style="display:block;background:#f6f3f1;border:1px solid #d8d2cd;border-radius:2000px;height:12px;overflow:hidden;">',
        `<span style="display:block;width:${width}%;height:12px;background:${color};border-radius:2000px;"></span>`,
        '</span>',
        `<span style="font-size:12px;text-align:right;color:#242424;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">${escapeHtml_(valueText)}</span>`,
        '</div>',
      ].join('');
    }).join(''),
    '</div>',
  ].join('');
}

function hypothesisMapHtml_(blocks) {
  const cards = (blocks || []).slice(0, 5).map((block, index) => [
    '<div style="border:1px solid #242424;border-radius:22px;background:#ffffff;padding:12px;">',
    `<p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#000000;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;">가설 ${index + 1}</p>`,
    `<p style="margin:0 0 6px;font-size:12px;line-height:1.45;color:#242424;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;"><strong>관찰된 숫자</strong> ${escapeHtml_(shortLearnerText_(block.actual_change, '데이터 확인 중'))}</p>`,
    `<p style="margin:0 0 6px;font-size:12px;line-height:1.45;color:#242424;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;"><strong>틀릴 수 있는 이유</strong> ${escapeHtml_(shortLearnerText_(block.counter_scenario || block.counter_question, '반대 시나리오 확인 중'))}</p>`,
    `<p style="margin:0;font-size:12px;line-height:1.45;color:#242424;font-family:'IBM Plex Mono','Noto Sans KR',Arial,sans-serif;"><strong>다음에 볼 데이터</strong> ${escapeHtml_(shortLearnerText_(block.next_validation_data || block.next_check, '다음 검증 데이터 확인'))}</p>`,
    '</div>',
  ].join('')).join('');
  if (!cards) return '';
  return [
    '<div data-ssmk="hypothesis-map" style="border:1px solid #242424;border-radius:28px;background:#cfdaf5;padding:16px;margin:0 0 16px;">',
    '<p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#242424;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">가설 복기 지도</p>',
    '<p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:#242424;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;">좋은 가설은 맞히는 문장이 아니라 나중에 고칠 수 있는 계약서입니다. 관찰된 숫자, 틀릴 수 있는 이유, 다음에 볼 데이터를 한 줄씩 묶어 둡니다.</p>',
    `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;">${cards}</div>`,
    '</div>',
  ].join('');
}

function sectionVisualGuideHtml_(model, blocks) {
  const sectionKey = String(model && model.section_key || '');
  if (sectionKey === 'market_map' || sectionKey === 'dividend_etf_corner') {
    return marketTemperatureHtml_(blocks);
  }
  if (sectionKey === 'hypothesis_lab') {
    return hypothesisMapHtml_(blocks);
  }
  return '';
}

function renderWeeklyLabEmailHtml_(context, sectionModels) {
  const sectionHtml = sectionModels
    .filter((model) => model.email_output)
    .sort((a, b) => a.section_order - b.section_order)
    .map((model) => {
      const blocks = contentBlocksFromSectionModel_(model);
      const visualGuideHtml = sectionVisualGuideHtml_(model, blocks);
      const bodyHtml = blocks.length > 0
        ? blocks.map(renderContentBlockHtml_).join('')
        : learnerHtmlBlock_('학습 메모', model.docs_markdown || model.email_html_summary || '이번 주 학습 내용을 정리 중입니다.');
      return [
        '<section style="margin:0 0 40px;border:1px solid #242424;border-radius:40px;padding:24px;background:#f6f3f1;">',
        '<div style="height:8px;width:88px;border-radius:2000px;background:#cfdaf5;border:1px solid #242424;margin:0 0 18px;"></div>',
        `<h2 style="font-family:Georgia,'Noto Serif KR',serif;font-size:26px;line-height:1.2;letter-spacing:-0.02px;margin:0 0 16px;color:#000000;">${escapeHtml_(model.visible_title_ko || sectionDisplayTitle_(model))}</h2>`,
        visualGuideHtml,
        bodyHtml,
        '</section>',
      ].join('');
    }).join('');
  const visualizationHtml = buildEmailVisualizationHtml_(context.visualization_queue || []);

  return [
    '<!doctype html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<style>',
    '@page { size: A4 portrait; margin: 14mm; }',
    '@media print { body { background:#ffffff !important; } section { break-inside: avoid-page; page-break-inside: avoid; } .ssmk-shell { max-width: 100% !important; padding: 0 !important; } .ssmk-page { border-radius: 0 !important; border: 0 !important; padding: 0 !important; } }',
    '@media (max-width: 640px) { [data-ssmk="learning-ladder"] { grid-template-columns: 1fr !important; } [data-ssmk="market-temperature"] div[style*="grid-template-columns:58px"] { grid-template-columns: 48px 1fr !important; } [data-ssmk="hypothesis-map"] div[style*="repeat(2"] { grid-template-columns: 1fr !important; } }',
    '</style>',
    '</head>',
    '<body style="margin:0;background:#f6f3f1;font-family:\'IBM Plex Mono\',\'Noto Sans KR\',Arial,sans-serif;color:#000000;">',
    '<div class="ssmk-shell" style="max-width:760px;margin:0 auto;padding:32px 18px;">',
    '<div class="ssmk-page" style="background:#ffffff;border:1px solid #242424;border-radius:40px;padding:32px;">',
    '<p style="display:inline-block;margin:0 0 14px;border:1px solid #242424;border-radius:2000px;padding:6px 12px;font-size:12px;letter-spacing:0.05px;color:#242424;background:#cfdaf5;">SSMK Weekly Lab</p>',
    `<h1 style="font-family:Georgia,'Noto Serif KR',serif;margin:0 0 14px;font-size:32px;line-height:1.2;letter-spacing:-0.02px;color:#000000;">${escapeHtml_(context.issue_date || today_())} 투자 관찰노트</h1>`,
    `<p style="margin:0 0 28px;font-size:14px;line-height:1.7;color:#4e4d4d;">${escapeHtml_(SSMK.disclaimer)}</p>`,
    visualizationHtml,
    sectionHtml,
    '<p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#4e4d4d;">이 메일은 투자 권유가 아니라 학습용 관찰 기록입니다. 최종 판단은 별도 확인이 필요합니다.</p>',
    '</div>',
    '</div>',
    '</body>',
    '</html>',
  ].join('');
}

function createWeeklyLabDraftReportDoc_(issueDate, runId) {
  const targetIssueDate = issueDate || today_();
  const initialContext = collectWeeklyLabReportContext_(targetIssueDate, '', runId);
  if (initialContext.weekly_scores.length === 0) {
    throw new Error(`${targetIssueDate} 기준 weekly_scores가 없어 보고서 초안을 만들 수 없습니다.`);
  }

  const sectionModels = buildWeeklyLabReportSectionModels_(initialContext);
  const preQualityResult = runWeeklyLabReportQualityGate_(initialContext, sectionModels, {});
  const reportText = renderWeeklyLabDocsDraft_(initialContext, sectionModels, preQualityResult);
  const doc = DocumentApp.create(`SSMK Weekly Lab 초안 보고서 - ${targetIssueDate}`);
  doc.getBody().setText(reportText);
  doc.saveAndClose();

  const reportStatus = preQualityResult.status === 'blocked' ? '사용자 확인 필요' : '초안 생성';
  const reportId = createReportRunRow_(targetIssueDate, addDaysText_(targetIssueDate, -6), targetIssueDate, reportStatus, doc.getUrl(), `Weekly Lab blueprint draft. QA=${preQualityResult.status}. 이메일 발송 없음.`);
  const context = Object.assign({}, initialContext, { report_id: reportId });
  const factCards = buildReportFactCards_(context);
  replaceReportFactCardsForReport_(reportId, factCards);

  sectionModels
    .slice()
    .sort((a, b) => a.section_order - b.section_order)
    .forEach((model) => {
      upsertReportSection_(
        reportId,
        model.section_key,
        model.section_title,
        model.status,
        model.docs_markdown || model.email_html_summary
      );
    });

  recordWeeklyLabQualityGateReview_(context, reportId, preQualityResult);
  createReportVersion_(reportId, 'v1', '', doc.getUrl(), 'Blueprint-based Weekly Lab draft report created');

  return {
    reportId: reportId,
    url: doc.getUrl(),
    qualityResult: preQualityResult,
  };
}

function rebuildWeeklyLabDraftForExistingReport_(report, runId) {
  const reportId = String(report && report.report_id || '').trim();
  const targetIssueDate = String(report && report.issue_date || '').slice(0, 10);
  if (!reportId) throw new Error('재생성할 report_id가 비어 있습니다.');
  if (!targetIssueDate) throw new Error('재생성할 issue_date가 비어 있습니다.');

  const context = collectWeeklyLabReportContext_(targetIssueDate, reportId, runId);
  if (context.weekly_scores.length === 0) {
    throw new Error(`${targetIssueDate} 기준 weekly_scores가 없어 개선 초안을 재생성할 수 없습니다.`);
  }

  const sectionModels = buildWeeklyLabReportSectionModels_(context);
  const qualityResult = runWeeklyLabReportQualityGate_(context, sectionModels, {});
  const reportText = renderWeeklyLabDocsDraft_(context, sectionModels, qualityResult);
  const doc = DocumentApp.create(`SSMK Weekly Lab 개선 초안 보고서 - ${targetIssueDate}`);
  doc.getBody().setText(reportText);
  doc.saveAndClose();

  const factCards = buildReportFactCards_(context);
  replaceReportFactCardsForReport_(reportId, factCards);

  sectionModels
    .slice()
    .sort((a, b) => a.section_order - b.section_order)
    .forEach((model) => {
      upsertReportSection_(
        reportId,
        model.section_key,
        model.section_title,
        model.status,
        model.docs_markdown || model.email_html_summary
      );
    });

  recordWeeklyLabQualityGateReview_(context, reportId, qualityResult);
  const versionLabel = nextReportVersionLabel_(reportId);
  createReportVersion_(reportId, versionLabel, '', doc.getUrl(), 'Rebuilt Weekly Lab draft with clearer teaching-insight sections. 이메일 발송 없음.');
  updateReportRunStatus_(
    reportId,
    qualityResult.status === 'blocked' ? '사용자 확인 필요' : '초안 생성',
    `5/12 개선 초안 재생성: ${doc.getUrl()}; quality=${qualityResult.status}`
  );

  return {
    ok: true,
    report_id: reportId,
    issue_date: targetIssueDate,
    doc_url: doc.getUrl(),
    quality_status: qualityResult.status,
    warning_count: qualityResult.warning_count,
    blocking_count: qualityResult.blocking_count,
  };
}

function createVisualizationQueueForReport_(issueDate, reportId) {
  const targetIssueDate = issueDate || today_();
  const scoreRows = readObjects_(SSMK.sheets.weeklyScores)
    .filter((row) => sameDateText_(row.issue_date, targetIssueDate));
  const marketRows = readObjects_(SSMK.sheets.marketData)
    .filter((row) => sameDateText_(row.market_date, targetIssueDate));
  const existingKeys = new Set(readObjects_(SSMK.sheets.visualizationQueue)
    .filter((row) => String(row.report_id) === String(reportId))
    .map((row) => String(row.section_key || '').trim()));
  const warnings = [];
  const items = [];

  if (scoreRows.length === 0) {
    warnings.push('weekly_scores 행이 없어 점수 시각화를 만들 수 없습니다.');
  } else {
    items.push({
      section_key: 'score_top5',
      chart_type: 'html_bar_list',
      data_range_or_source: `weekly_scores issue_date=${targetIssueDate}`,
      title: '관찰 점수 Top 5',
      description: buildTopScoreVisualizationSummary_(scoreRows, 5),
      owner_agent: '루미',
    });
    items.push({
      section_key: 'confidence_mix',
      chart_type: 'html_badge_summary',
      data_range_or_source: `weekly_scores issue_date=${targetIssueDate}`,
      title: '데이터 신뢰도 분포',
      description: summarizeConfidence_(scoreRows),
      owner_agent: '벡터',
    });
  }

  if (marketRows.length === 0) {
    warnings.push('market_data 행이 없어 가격 변화 시각화를 만들 수 없습니다.');
  } else {
    items.push({
      section_key: 'market_change_1w',
      chart_type: 'html_bar_list',
      data_range_or_source: `market_data market_date=${targetIssueDate}`,
      title: '1주 가격 변화 관찰',
      description: buildMarketChangeVisualizationSummary_(marketRows, 5),
      owner_agent: '벡터',
    });
  }

  let createdCount = 0;
  items.forEach((item, index) => {
    if (existingKeys.has(item.section_key)) return;
    appendObject_(SSMK.sheets.visualizationQueue, SSMK.headers.visualizationQueue, {
      chart_id: `VIZ-${compactDate_(targetIssueDate)}-${pad3_(index + 1)}`,
      issue_date: targetIssueDate,
      report_id: reportId,
      section_key: item.section_key,
      chart_type: item.chart_type,
      data_range_or_source: item.data_range_or_source,
      title: item.title,
      description: item.description,
      status: 'success',
      owner_agent: item.owner_agent,
      output_url: '',
      notes: '이메일 HTML에서 인라인 요약 시각화로 자동 표시됩니다.',
    });
    createdCount += 1;
  });

  if (createdCount > 0) {
    upsertReportSection_(reportId, 'visualization_summary', '자동 시각화 요약', 'draft', items.map((item) => `${item.title}: ${item.description}`).join(' / '));
  }

  return {
    ok: true,
    report_id: reportId,
    created_visualization_rows: createdCount,
    warning_summary: warnings.join(' / '),
  };
}

function buildTopScoreVisualizationSummary_(rows, count) {
  return rows
    .slice()
    .sort((a, b) => estimateScoreFromRow_(b) - estimateScoreFromRow_(a))
    .slice(0, count)
    .map((row) => `${row.ticker || '-'} ${estimateScoreFromRow_(row)}`)
    .join(', ');
}

function buildMarketChangeVisualizationSummary_(rows, count) {
  return rows
    .slice()
    .filter((row) => row.change_pct_1w !== '')
    .sort((a, b) => Math.abs(Number(b.change_pct_1w || 0)) - Math.abs(Number(a.change_pct_1w || 0)))
    .slice(0, count)
    .map((row) => `${row.symbol || '-'} ${roundTo2_(Number(row.change_pct_1w || 0))}%`)
    .join(', ');
}

function createEmailFinalReportDraft(reportId) {
  const report = findReportRun_(reportId);
  if (!report) throw new Error(`report_id를 찾을 수 없습니다: ${reportId}`);

  const sectionRows = readObjects_(SSMK.sheets.reportSections)
    .filter((row) => String(row.report_id) === String(reportId));
  const qaRows = getQaRowsForReport_(reportId);
  const html = buildEmailFinalReportHtml_(report, sectionRows, qaRows);
  const file = DriveApp.createFile(
    `SSMK email final draft - ${reportId}.html`,
    html,
    MimeType.HTML
  );
  const versionLabel = nextReportVersionLabel_(reportId);

  createReportVersion_(reportId, versionLabel, '', file.getUrl(), 'Email HTML final draft created. 이메일 발송 전 검토용 HTML 최종본입니다.');
  updateReportRunStatus_(reportId, report.generation_status || '초안 생성', `이메일용 HTML 최종본 생성: ${file.getUrl()}`);
  const publishQuality = runPublishQualityGate_({
    report_id: reportId,
    html: html,
    source_snapshot: {},
  });
  recordPublishQualityGateReview_(
    collectWeeklyLabReportContext_(report.issue_date || today_(), reportId, ''),
    reportId,
    versionLabel,
    publishQuality
  );

  return {
    ok: true,
    report_id: reportId,
    version_label: versionLabel,
    html_url: file.getUrl(),
    message: '이메일 발송 전 검토할 HTML 최종본을 만들었습니다. 아직 이메일은 보내지 않았습니다.',
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
  const latestPublishQc = getLatestPublishQualityGateReview_(reportId);
  const sendGate = canSendReportWithPublishQc_(report, latestPublishQc);
  if (!sendGate.ok) {
    throw new Error(`세이지 Publish QC 때문에 발송할 수 없습니다: ${sendGate.reason}`);
  }

  const recipients = collectActiveRecipientEmails_();
  if (recipients.length === 0) {
    throw new Error('발송 차단: recipients 시트에 active 수신자 이메일이 없습니다.');
  }

  const sectionRows = readObjects_(SSMK.sheets.reportSections)
    .filter((row) => String(row.report_id) === String(reportId));
  const qaRows = getQaRowsForReport_(reportId);
  const htmlBody = buildEmailFinalReportHtml_(report, sectionRows, qaRows);

  MailApp.sendEmail({
    to: recipients.join(','),
    subject: report.email_subject || `[SSMK] Weekly Lab ${report.issue_date || today_()}`,
    htmlBody: htmlBody,
    name: 'SSMK Weekly Lab',
  });

  markReportSent_(reportId, `HTML 이메일 발송 완료: ${recipients.length}명`);
  return {
    ok: true,
    report_id: reportId,
    sent_count: recipients.length,
    message: '승인된 리포트를 HTML 이메일로 발송했습니다.',
  };
}

function buildEmailFinalReportHtml_(report, sectionRows, qaRows) {
  const context = collectWeeklyLabReportContext_(report.issue_date || today_(), report.report_id || '', '');
  const blueprintByKey = new Map((context.blueprint_sections || []).map((section) => [section.section_key, section]));
  const models = (sectionRows || []).map((section, index) => {
    const blueprint = blueprintByKey.get(String(section.section_key || '').trim()) || {
      section_key: section.section_key || `section_${index + 1}`,
      section_order: index + 1,
      section_title: section.section_title || section.section_key || '섹션',
      required: false,
      docs_output: true,
      email_output: true,
      data_sources: '',
      beginner_purpose: '자세한 내용은 Google Docs 초안에서 검토합니다.',
    };
    return sectionModel_(
      blueprint,
      section.content_summary || '',
      section.content_summary || '',
      '',
      ''
    );
  }).filter((model) => model.email_output);

  if (models.length === 0) {
    models.push(sectionModel_({
      section_key: 'summary',
      section_order: 1,
      section_title: '이번 주 학습 요약',
      required: false,
      docs_output: true,
      email_output: true,
      data_sources: '',
      beginner_purpose: '자세한 내용은 Google Docs 초안에서 검토합니다.',
    }, '자세한 내용은 Google Docs 초안에서 검토합니다.', '자세한 내용은 Google Docs 초안에서 검토합니다.', '', ''));
  }

  return renderWeeklyLabEmailHtml_(context, models);
}

function buildEmailVisualizationHtml_(visualizationRows) {
  if (!visualizationRows || visualizationRows.length === 0) return '';

  const itemHtml = visualizationRows.map((row) => [
    '<div style="border:1px solid #d9dee6;border-radius:8px;padding:12px;background:#ffffff;">',
    `<p style="margin:0 0 4px;font-size:12px;color:#5f6b7a;">${escapeHtml_(row.chart_type || 'visual')}</p>`,
    `<h3 style="margin:0 0 8px;font-size:15px;color:#1f2937;">${escapeHtml_(row.title || row.section_key || '시각화')}</h3>`,
    `<p style="margin:0;font-size:13px;line-height:1.55;color:#263241;">${escapeHtml_(row.description || '요약 준비 중')}</p>`,
    '</div>',
  ].join('')).join('');

  return [
    '<section style="border-top:1px solid #d9dee6;padding:18px 0;">',
    '<h2 style="font-size:18px;margin:0 0 10px;color:#1f2937;">자동 시각화</h2>',
    '<div style="display:grid;grid-template-columns:1fr;gap:10px;">',
    itemHtml,
    '</div>',
    '</section>',
  ].join('');
}

function getQaRowsForReport_(reportId) {
  const runIds = new Set(readObjects_(SSMK.sheets.automationRunLog)
    .filter((row) => String(row.report_id) === String(reportId))
    .map((row) => String(row.run_id || '').trim())
    .filter(Boolean));

  return readObjects_(SSMK.sheets.qaReviewLog)
    .filter((row) => runIds.size === 0 || runIds.has(String(row.run_id || '').trim()));
}

function collectActiveRecipientEmails_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SSMK.sheets.recipients);
  if (!sheet || sheet.getLastRow() < 2 || sheet.getLastColumn() < 1) return [];

  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
  const headers = values[0].map((header) => String(header || '').trim().toLowerCase());
  const emailIndex = firstExistingIndex_(headers, ['email', 'email_address', 'recipient_email', '이메일']);
  const activeIndex = firstExistingIndex_(headers, ['active', 'enabled', '수신여부']);
  if (emailIndex < 0) return [];

  return values.slice(1)
    .map((row) => ({
      email: String(row[emailIndex] || '').trim(),
      active: activeIndex < 0 ? 'TRUE' : String(row[activeIndex] || '').trim().toUpperCase(),
    }))
    .filter((row) => row.email && ['TRUE', 'ON', 'YES', 'Y', '활성'].indexOf(row.active || 'TRUE') !== -1)
    .map((row) => row.email);
}

function firstExistingIndex_(items, candidates) {
  for (let index = 0; index < candidates.length; index += 1) {
    const found = items.indexOf(candidates[index]);
    if (found !== -1) return found;
  }
  return -1;
}

function nextReportVersionLabel_(reportId) {
  const numbers = readObjects_(SSMK.sheets.reportVersions)
    .filter((row) => String(row.report_id) === String(reportId))
    .map((row) => /^v(\d+)/i.exec(String(row.version_label || '').trim()))
    .filter(Boolean)
    .map((match) => Number(match[1]))
    .filter((value) => !Number.isNaN(value));
  const next = numbers.length === 0 ? 1 : Math.max.apply(null, numbers) + 1;
  return `v${next}`;
}

function markReportSent_(reportId, notes) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SSMK.sheets.reportRuns);
  if (!sheet || sheet.getLastRow() < 2) return false;

  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
  const headers = values[0];
  const reportIdColumn = headers.indexOf('report_id') + 1;
  const statusColumn = headers.indexOf('generation_status') + 1;
  const sentAtColumn = headers.indexOf('sent_at') + 1;
  const notesColumn = headers.indexOf('notes') + 1;

  if (reportIdColumn < 1 || statusColumn < 1 || sentAtColumn < 1) return false;

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    if (values[rowIndex][reportIdColumn - 1] === reportId) {
      sheet.getRange(rowIndex + 1, statusColumn).setValue('발송 완료');
      sheet.getRange(rowIndex + 1, sentAtColumn).setValue(nowText_());
      if (notesColumn > 0) sheet.getRange(rowIndex + 1, notesColumn).setValue(notes || '');
      return true;
    }
  }
  return false;
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
    .replace(/높은 관찰 등급을 유지할 수 있다/g, '높은 관찰 등급을 설명하는 지표가 유지되는지 검증해야 한다')
    .replace(/높은 관찰 등급을 유지할 수 있습니다/g, '높은 관찰 등급을 설명하는 지표가 유지되는지 검증해야 합니다')
    .replace(/성장 기대는 강하지만/g, '성장 기대는 가격에 강하게 반영된 것으로 판단되지만')
    .replace(/점수 회복 가능성이 있다/g, '점수 회복을 예상하려면 점수를 낮춘 원인 지표가 함께 개선되어야 한다')
    .replace(/점수 회복 가능성이 있습니다/g, '점수 회복을 예상하려면 점수를 낮춘 원인 지표가 함께 개선되어야 합니다')
    .replace(/좋아 보인다/g, '개선 신호로 판단할 수 있다')
    .replace(/좋아 보입니다/g, '개선 신호로 판단할 수 있습니다')
    .replace(/긍정적입니다/g, '개선 신호로 판단할 수 있습니다')
    .replace(/긍정적이다/g, '개선 신호로 판단할 수 있다')
    .replace(/기회가 될 수 있다/g, '가설 검증 후보로 볼 수 있다')
    .replace(/기회가 될 수 있습니다/g, '가설 검증 후보로 볼 수 있습니다')
    .replace(/매력 증가/g, '관찰 가치 증가')
    .replace(/매력적/g, '관찰 가치가 높은');
}

function hasRecommendationLikeLanguage_(text) {
  return /(매수|매도|투자\s*추천|매수\s*추천|매도\s*추천|추천\s*(종목|대상|타이밍|매수|매도)|확실한?\s*기회|수익\s*(기회|보장|확정|가능)|지금\s*사|사야\s*할|투자\s*기회)/.test(text);
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

  const targetHeaders = SSMK.headers.watchlist;
  const lastColumn = Math.max(1, sheet.getLastColumn());
  const lastRow = Math.max(1, sheet.getLastRow());
  const header = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0]
    .map((value) => String(value || '').trim());
  const headerMatchesTarget = targetHeaders.every((targetHeader, index) => header[index] === targetHeader);
  const hasKnownWatchlistHeader = targetHeaders.some((targetHeader) => header.indexOf(targetHeader) !== -1);
  const shouldRemapData = !headerMatchesTarget && hasKnownWatchlistHeader && lastRow > 1;

  if (shouldRemapData) {
    const headerIndexByName = header.reduce((acc, headerName, index) => {
      if (headerName && !Object.prototype.hasOwnProperty.call(acc, headerName)) {
        acc[headerName] = index;
      }
      return acc;
    }, {});
    const values = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
    const remappedValues = values.map((row) => targetHeaders.map((targetHeader) => {
      if (!Object.prototype.hasOwnProperty.call(headerIndexByName, targetHeader)) return '';
      const value = row[headerIndexByName[targetHeader]];
      return value === undefined || value === null ? '' : value;
    }));

    setHeaders_(ss, SSMK.sheets.watchlist, targetHeaders);
    sheet.getRange(2, 1, remappedValues.length, targetHeaders.length).setValues(remappedValues);
    return;
  }

  setHeaders_(ss, SSMK.sheets.watchlist, targetHeaders);
}

function applyWeeklyScoreFormulas_(ss) {
  const sheet = ss.getSheetByName(SSMK.sheets.weeklyScores);
  if (!sheet) return;
  if (sheet.getLastRow() < 2) return;

  const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, SSMK.headers.weeklyScores.length).getDisplayValues();
  values.forEach((row, index) => {
    const rowNumber = index + 2;
    const ticker = String(row[2] || '').trim();
    if (!ticker) return;

    if (!row[13] || row[13] === '#REF!') {
      setFormulaIfDifferent_(sheet.getRange(rowNumber, 14), `=ROUND(H${rowNumber}*0.30 + I${rowNumber}*0.20 + J${rowNumber}*0.20 + K${rowNumber}*0.15 + L${rowNumber}*0.10 + M${rowNumber}*0.05, 2)`);
    }
    if (!row[14] || row[14] === '#REF!') {
      setFormulaIfDifferent_(sheet.getRange(rowNumber, 15), `=IF(N${rowNumber}="","",IF(N${rowNumber}>=8,"높음",IF(N${rowNumber}>=6,"중간","낮음")))`);
    }
    if (!row[16] || row[16] === '#REF!') {
      setFormulaIfDifferent_(sheet.getRange(rowNumber, 17), `=IF(C${rowNumber}="","",IFERROR(N${rowNumber}-P${rowNumber},""))`);
    }
  });
  SpreadsheetApp.flush();
}

function repairWeeklyScoresLayout() {
  const ss = SpreadsheetApp.getActive();
  ensureWorkbookSchemaSheets_(ss);
  const sheet = ss.getSheetByName(SSMK.sheets.weeklyScores);
  if (!sheet || sheet.getLastRow() < 2) {
    return { ok: true, moved_rows: 0, message: 'weekly_scores에 정리할 데이터가 없습니다.' };
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const issueDateColumn = headers.indexOf('issue_date') + 1;
  const tickerColumn = headers.indexOf('ticker') + 1;
  if (issueDateColumn < 1 || tickerColumn < 1) {
    throw new Error('weekly_scores에서 issue_date 또는 ticker 컬럼을 찾지 못했습니다.');
  }

  const lastColumn = SSMK.headers.weeklyScores.length;
  const maxRows = sheet.getMaxRows();
  const values = sheet.getRange(2, 1, maxRows - 1, lastColumn).getValues();
  const displayValues = sheet.getRange(2, 1, maxRows - 1, lastColumn).getDisplayValues();
  const rowsToKeep = [];
  let movedRows = 0;

  displayValues.forEach((displayRow, index) => {
    const hasIssueDate = String(displayRow[issueDateColumn - 1] || '').trim() !== '';
    const hasTicker = String(displayRow[tickerColumn - 1] || '').trim() !== '';
    if (!hasIssueDate && !hasTicker) return;
    rowsToKeep.push(values[index]);
    if (index + 2 > rowsToKeep.length + 1) movedRows += 1;
  });

  if (maxRows > 1) {
    sheet.getRange(2, 1, maxRows - 1, lastColumn).clearContent();
  }
  if (rowsToKeep.length > 0) {
    sheet.getRange(2, 1, rowsToKeep.length, lastColumn).setValues(rowsToKeep);
  }
  applyWeeklyScoreFormulas_(ss);
  SpreadsheetApp.flush();

  return {
    ok: true,
    moved_rows: movedRows,
    kept_rows: rowsToKeep.length,
    message: `weekly_scores 정리 완료: 데이터 행 ${rowsToKeep.length}개를 위쪽으로 정렬했습니다.`,
  };
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
  setDropdown_(ss, SSMK.sheets.reportBlueprint, 4, SSMK.dropdowns.yesNo);
  setDropdown_(ss, SSMK.sheets.reportBlueprint, 5, SSMK.dropdowns.yesNo);
  setDropdown_(ss, SSMK.sheets.reportBlueprint, 6, SSMK.dropdowns.yesNo);
  setDropdown_(ss, SSMK.sheets.reportBlueprint, 7, SSMK.dropdowns.yesNo);
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
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  const existingHeaders = headerRange.getDisplayValues()[0];
  const headerChanged = headers.some((header, index) => String(existingHeaders[index] || '') !== String(header));

  if (headerChanged) {
    headerRange.setValues([headers]);
    headerRange
      .setFontWeight('bold')
      .setFontColor('#ffffff')
      .setBackground('#1e446b');
    sheet.autoResizeColumns(1, headers.length);
  }
}

function setDropdown_(ss, sheetName, columnNumber, values) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  const maxRows = computeDropdownTargetRowCount_(sheet.getLastRow(), sheet.getMaxRows());
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, columnNumber, maxRows, 1).setDataValidation(rule);
}

function setFormulaIfDifferent_(range, formula) {
  if (String(range.getFormula() || '') === String(formula || '')) return;
  range.setFormula(formula);
}

function logSetupProgress_(message, enabled) {
  if (!enabled) return;
  console.log(`[SSMK setup ${SSMK_SETUP_BUILD}] ${message}`);
}

function notifySsmk_(message, title) {
  const safeMessage = String(message || '');
  const safeTitle = String(title || 'SSMK');

  console.log(`[${safeTitle}] ${safeMessage}`);
  Logger.log(`[${safeTitle}] ${safeMessage}`);

  try {
    const ss = SpreadsheetApp.getActive();
    if (ss && typeof ss.toast === 'function') {
      ss.toast(safeMessage, safeTitle, 5);
    }
  } catch (error) {
    console.log(`[${safeTitle}] toast skipped: ${error.message}`);
  }
}

function computeDropdownTargetRowCount_(lastRow, maxRows) {
  const safeLastRow = Math.max(Number(lastRow) || 1, 1);
  const safeMaxRows = Math.max(Number(maxRows) || 2, 2);
  const dataRows = Math.max(safeLastRow - 1, 0);
  const cappedBufferedRows = Math.min(
    Math.max(dataRows + WORKBOOK_SETUP_LIMITS.dropdownBufferRows, WORKBOOK_SETUP_LIMITS.minDropdownRows),
    WORKBOOK_SETUP_LIMITS.maxDropdownRows
  );
  const sheetCapacityRows = Math.max(safeMaxRows - 1, 1);

  return Math.min(Math.max(cappedBufferedRows, dataRows, 1), sheetCapacityRows);
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

function getPreferenceValue_(key, fallback) {
  const row = readObjects_(SSMK.sheets.userPreferences).find((item) => String(item.setting_key) === String(key));
  return row && row.setting_value !== '' ? row.setting_value : fallback;
}

function getScheduleRow_(key) {
  return readObjects_(SSMK.sheets.automationSchedules).find((item) => String(item.schedule_key) === String(key));
}

function getWeeklyLabScheduleKey_() {
  const primary = getScheduleRow_(WEEKLY_LAB_PRIMARY_SCHEDULE_KEY);
  if (primary) return WEEKLY_LAB_PRIMARY_SCHEDULE_KEY;
  return WEEKLY_LAB_LEGACY_SCHEDULE_KEY;
}

function getWeeklyLabScheduleRow_() {
  return getScheduleRow_(getWeeklyLabScheduleKey_()) || {};
}

function updateWeeklyLabScheduleMetadata_(metadata) {
  updateScheduleMetadata_(getWeeklyLabScheduleKey_(), metadata);
}

function getWeeklyLabScheduleConfig_() {
  const schedule = getWeeklyLabScheduleRow_();
  const runDay = String(getPreferenceValue_('weekly_lab_run_day', 'TUESDAY')).trim().toUpperCase();
  const runHour = Number(getPreferenceValue_('weekly_lab_run_hour', 8));

  return {
    scheduleKey: getWeeklyLabScheduleKey_(),
    enabled: normalizeOnOffText_(schedule.enabled || 'ON') || 'ON',
    runDay: toValidWeekDayText_(runDay),
    runHour: Math.max(0, Math.min(23, Number.isNaN(runHour) ? 8 : Math.round(runHour))),
  };
}

function toValidWeekDayText_(dayText) {
  const normalized = String(dayText || '').trim().toUpperCase();
  return [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ].indexOf(normalized) === -1 ? 'TUESDAY' : normalized;
}

function toScriptWeekDay_(dayText) {
  const normalized = toValidWeekDayText_(dayText);
  return {
    MONDAY: ScriptApp.WeekDay.MONDAY,
    TUESDAY: ScriptApp.WeekDay.TUESDAY,
    WEDNESDAY: ScriptApp.WeekDay.WEDNESDAY,
    THURSDAY: ScriptApp.WeekDay.THURSDAY,
    FRIDAY: ScriptApp.WeekDay.FRIDAY,
    SATURDAY: ScriptApp.WeekDay.SATURDAY,
    SUNDAY: ScriptApp.WeekDay.SUNDAY,
  }[normalized];
}

function localizeWeekDay_(dayText) {
  return {
    MONDAY: '월요일',
    TUESDAY: '화요일',
    WEDNESDAY: '수요일',
    THURSDAY: '목요일',
    FRIDAY: '금요일',
    SATURDAY: '토요일',
    SUNDAY: '일요일',
  }[toValidWeekDayText_(dayText)];
}

function countWeeklyLabTriggers_() {
  return ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === 'scheduledWeeklyLabTrigger')
    .length;
}

function deleteWeeklyLabTriggers_() {
  const triggers = ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === 'scheduledWeeklyLabTrigger');
  triggers.forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  return triggers.length;
}

function updateScheduleMetadata_(scheduleKey, changes) {
  const ss = SpreadsheetApp.getActive();
  ensureControlCenterSheets_(ss);
  const sheet = ss.getSheetByName(SSMK.sheets.automationSchedules);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
  const rows = readIndexedObjects_(SSMK.sheets.automationSchedules);
  const existing = rows.find((row) => String(row.schedule_key) === String(scheduleKey));
  const rowObject = buildScheduleRowObject_(existing, scheduleKey, existing ? existing.enabled : 'ON');

  Object.keys(changes || {}).forEach((key) => {
    rowObject[key] = changes[key];
  });
  upsertRowByKey_(sheet, headers, 'schedule_key', scheduleKey, rowObject);
}

function hasExistingWeeklyLabRunForIssueDate_(issueDate) {
  const targetIssueDate = String(issueDate || '').slice(0, 10);
  if (!targetIssueDate) return false;

  return readObjects_(SSMK.sheets.reportRuns).some((row) => {
    if (!sameDateText_(row.issue_date, targetIssueDate)) return false;
    const status = String(row.generation_status || '').trim();
    return ['초안 생성', '사용자 확인 필요', '승인', '발송 완료'].indexOf(status) !== -1;
  });
}

function findLatestWeeklyLabReportForIssueDate_(issueDate) {
  const targetIssueDate = String(issueDate || '').slice(0, 10);
  if (!targetIssueDate) return null;

  const rows = readObjects_(SSMK.sheets.reportRuns)
    .filter((row) => sameDateText_(row.issue_date, targetIssueDate))
    .filter((row) => {
      const status = String(row.generation_status || '').trim();
      return ['초안 생성', '사용자 확인 필요', '승인', '발송 완료'].indexOf(status) !== -1;
    });
  return latestRowByText_(rows, 'generated_at') || latestRowByText_(rows, 'report_id');
}

function reportHasEmailHtmlDraft_(reportId) {
  const normalizedReportId = String(reportId || '').trim();
  if (!normalizedReportId) return false;

  return readObjects_(SSMK.sheets.reportVersions).some((row) => {
    if (String(row.report_id || '').trim() !== normalizedReportId) return false;
    const summary = String(row.change_summary || row.notes || '').trim();
    return Boolean(row.output_url) && /Email HTML final draft|이메일용 HTML 최종본/.test(summary);
  });
}

function latestRowByText_(rows, fieldName) {
  if (!rows || rows.length === 0) return null;
  return rows
    .filter((row) => row && row[fieldName])
    .sort((a, b) => String(a[fieldName]).localeCompare(String(b[fieldName])))
    .pop() || null;
}

function normalizeFullCycleOptions_(options) {
  const mode = String(options && options.mode ? options.mode : 'resume').trim().toLowerCase();
  return {
    mode: mode === 'restart' ? 'restart' : 'resume',
    triggerSource: String(options && options.triggerSource ? options.triggerSource : 'manual_force').trim(),
  };
}

function resetIssueDateWorkingRows_(issueDate) {
  deleteIssueDateRows_(SSMK.sheets.marketData, 'market_date', issueDate);
  deleteIssueDateRows_(SSMK.sheets.newsEvents, 'date', issueDate);
  deleteIssueDateRows_(SSMK.sheets.weeklyScores, 'issue_date', issueDate);
  deleteIssueDateRows_(SSMK.sheets.sectorThemeScores, 'issue_date', issueDate);
  deleteIssueDateRows_(SSMK.sheets.visualizationQueue, 'issue_date', issueDate);
  deleteIssueDateRows_(SSMK.sheets.hypothesisReviews, 'issue_date', issueDate);
}

function deleteIssueDateRows_(sheetName, dateHeader, issueDate) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return 0;

  const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
  const headers = values[0];
  const dateColumn = headers.indexOf(dateHeader) + 1;
  if (dateColumn < 1) return 0;

  let deletedCount = 0;
  for (let rowIndex = values.length - 1; rowIndex >= 1; rowIndex -= 1) {
    if (sameDateText_(values[rowIndex][dateColumn - 1], issueDate)) {
      sheet.deleteRow(rowIndex + 1);
      deletedCount += 1;
    }
  }
  return deletedCount;
}

function getActiveWatchlistRows_() {
  return readObjects_(SSMK.sheets.watchlist)
    .filter((row) => {
      const active = String(row.active || 'TRUE').trim().toUpperCase();
      return active === '' || active === 'TRUE' || active === 'ON' || active === 'YES';
    })
    .filter((row) => String(row.ticker || '').trim());
}

function googleFinanceSymbolFormula_(symbol) {
  const normalized = String(symbol || '').trim().toUpperCase();
  if (normalized === 'LVMUY') return 'OTCMKTS:LVMUY';
  return normalized;
}

function isHardToAutomateTicker_(symbol) {
  return ['LVMUY'].indexOf(String(symbol || '').trim().toUpperCase()) !== -1;
}

function latestPreviousScoreByTicker_(issueDate) {
  const result = {};
  readObjects_(SSMK.sheets.weeklyScores)
    .filter((row) => row.ticker && row.issue_date && String(row.issue_date).slice(0, 10) < String(issueDate).slice(0, 10))
    .sort((a, b) => String(a.issue_date).localeCompare(String(b.issue_date)))
    .forEach((row) => {
      const ticker = String(row.ticker || '').trim().toUpperCase();
      result[ticker] = row.ssmk_total_score || '';
    });
  return result;
}

function deriveStarterScoresFromWatchlist_(item) {
  const priority = String(item.tracking_priority || '').trim().toLowerCase();
  const style = String(item.investment_style || '').toLowerCase();
  const tags = String(item.theme_tags || '').toLowerCase();
  const dividendFocus = String(item.dividend_focus || '').trim().toLowerCase();
  const coreScore = priority === 'high' ? 8.2 : priority === 'low' ? 6.2 : 7.1;
  const shareholderScore = dividendFocus === 'yes' ? 7.8 : dividendFocus === 'low' ? 4.8 : 5.4;
  const industryScore = /ai|cloud|클라우드|헬스케어|제약|energy|에너지/.test(tags) ? 7.6 : 7.0;
  const businessScore = /platform|플랫폼|subscription|구독|cloud|클라우드|ecosystem|생태계/.test(style + tags) ? 8.0 : 7.0;
  const valuationScore = /성장주|growth|ai|반도체|비만/.test(style + tags) ? 6.0 : 6.8;
  const insiderScore = 5.8;

  return {
    core_score: coreScore,
    shareholder_return_score: shareholderScore,
    industry_score: industryScore,
    business_model_score: businessScore,
    valuation_timing_score: valuationScore,
    insider_event_score: insiderScore,
    uncertainty_level: valuationScore < 6.3 ? '높음' : '중간',
    risk_flag: valuationScore < 6.3 ? 'valuation_risk' : 'data_check_required',
  };
}

function estimateScoreFromRow_(row) {
  const existing = Number(row.ssmk_total_score);
  if (!Number.isNaN(existing) && existing > 0) return existing;
  return (
    Number(row.core_score || 0) * 0.30 +
    Number(row.shareholder_return_score || 0) * 0.20 +
    Number(row.industry_score || 0) * 0.20 +
    Number(row.business_model_score || 0) * 0.15 +
    Number(row.valuation_timing_score || 0) * 0.10 +
    Number(row.insider_event_score || 0) * 0.05
  );
}

function summarizeTopRows_(rows, count) {
  return rows.slice(0, count).map((row, index) => `${index + 1}. ${row.ticker} ${row.company}: ${row.hypothesis_summary}`).join(' / ');
}

function summarizeHypotheses_(rows, count) {
  return rows.slice(0, count).map((row) => `${row.ticker}: ${row.evidence_metrics} 확인`).join(' / ');
}

function buildWeeklyLabDraftReportText_(issueDate, runId, rows) {
  const context = collectWeeklyLabReportContext_(issueDate, '', runId);
  const fallbackContext = Object.assign({}, context, {
    weekly_scores: context.weekly_scores.length > 0 ? context.weekly_scores : (rows || []),
  });
  const sectionModels = buildWeeklyLabReportSectionModels_(fallbackContext);
  const qualityResult = runWeeklyLabReportQualityGate_(fallbackContext, sectionModels, {});
  return renderWeeklyLabDocsDraft_(fallbackContext, sectionModels, qualityResult);
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

  let score = 85;
  sectionRows.forEach((row) => {
    const status = String(row.status || '').trim().toLowerCase();
    if (status === 'approved') score += 4;
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

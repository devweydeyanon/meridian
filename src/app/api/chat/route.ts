// Banking knowledge base for smart responses
const KNOWLEDGE_BASE: Record<string, string> = {
  'checking': 'We offer 4 checking accounts: Total Checking® ($0 fee with direct deposit), Secure Checking ($5/mo), Premier Checking (for balances $15K+), and Student Checking (no fee ages 17-24). Visit /personal/compare-checking.html to compare.',
  'savings': 'Our High Yield Savings earns 4.25% APY with no minimum balance. We also offer Money Market accounts (tiered rates up to 4.50%) and CDs (3 months to 5 years). See rates at /personal/savings-rates.html.',
  'credit card': 'We have 3 cards: Cash Back (1.5% unlimited, no annual fee), Travel Rewards (3X points, $95/yr), and Balance Transfer (0% for 21 months). Compare at /personal/compare-cards.html.',
  'mortgage': 'Current mortgage rates: 30-year fixed at 6.375%, 15-year at 5.750%, 5/1 ARM at 5.875%. Down payments from 3%. Apply at /personal/mortgages.html.',
  'loan': 'Personal loans from 6.99% APR, $2K-$50K, no origination fee. Auto loans from 5.49% for new vehicles. Home equity lines from 7.49%. Visit /personal/personal-loans.html.',
  'business': 'Business accounts start at $10/mo (Essential) or $30/mo (Performance) with fee waivers. We also offer business credit cards, lines of credit, and SBA lending. Visit /business.',
  'invest': 'Self-directed investing with $0 commissions and $0 minimums. Managed portfolios at 0.35%/year. IRA accounts (Traditional, Roth, Rollover) available. Visit /personal/self-directed-investing.html.',
  'fee': 'Total Checking: $0 with $500+ direct deposit. Secure: $5/mo. Premier: $0 with $15K balance. Student: $0 for ages 17-24. No ATM fees at 16,000+ locations nationwide.',
  'hours': 'Online and mobile banking available 24/7. Phone support: 1-800-MERIDIAN, 24/7. Branches: Mon-Fri 9am-5pm, Sat 9am-1pm. Find locations at /branches.',
  'transfer': 'You can send money via Zelle® (instant), wire transfer (domestic $30, international $45), or ACH (free, 1-3 days). Premier Checking includes free wire transfers.',
  'routing': 'The Meridian Bank routing number is 021000089. You can find it in the mobile app under Account Details.',
  'fraud': 'If you suspect fraud, call 1-800-MERIDIAN immediately. You can also lock your card in the mobile app. You\'re covered by our Zero Liability protection. Visit /security for more.',
  'open account': 'You can open an account online in minutes at /open-account. You\'ll need a government ID, SSN, and initial deposit. Some accounts have no minimum.',
};

function getSmartResponse(message: string): string {
  const lower = message.toLowerCase();
  
  for (const [key, response] of Object.entries(KNOWLEDGE_BASE)) {
    if (lower.includes(key)) {
      return response;
    }
  }

  // Greeting detection
  if (/^(hi|hello|hey|good morning|good afternoon)/.test(lower)) {
    return 'Hello! Welcome to Meridian Bank. I can help you with accounts, rates, transfers, loans, credit cards, or any other banking questions. What can I help you with today?';
  }

  // Thank you
  if (/thank|thanks/.test(lower)) {
    return 'You\'re welcome! Is there anything else I can help you with?';
  }

  // Agent request
  if (/agent|human|representative|speak|talk/.test(lower)) {
    return 'I\'d be happy to connect you with a live representative. Please call 1-800-MERIDIAN (available 24/7) or visit any of our 500+ branches. You can also send a secure message through online banking.';
  }

  return 'I can help with checking & savings accounts, credit cards, loans & mortgages, investing, transfers, fees, branch hours, and more. Could you tell me more about what you\'re looking for?';
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`chat:${ip}`, 20, 60000);
    if (!allowed) return NextResponse.json({ error: 'Too many messages. Slow down.' }, { status: 429 });

    const body = await req.json();
    const message = sanitize(body.message || '');
    const session_id = body.session_id;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const sql = getDB();
    const sid = session_id || 'session_' + Date.now();

    // Store user message
    await sql`
      INSERT INTO chat_messages (session_id, role, content)
      VALUES (${sid}, 'user', ${message})
    `;

    // Generate response
    const response = getSmartResponse(message);

    // Store bot response
    await sql`
      INSERT INTO chat_messages (session_id, role, content)
      VALUES (${sid}, 'assistant', ${response})
    `;

    return NextResponse.json({
      response,
      session_id: sid,
    });
  } catch (error: any) {
    logger.error('Chat error', { error: error.message });
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}

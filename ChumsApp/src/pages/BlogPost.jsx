import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams();

  // Blog posts data that matches the Learning Hub articles
  const blogPosts = {
    1: {
  title: "What is Investing? Complete Guide for Kenyan Beginners",
  author: "Jane Doe",
  publishDate: "July 20, 2024",
  readTime: "8 min read",
  category: "Risk Management",
  image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&h=400&fit=crop",
  tags: ["risk", "investing", "beginners", "portfolio"],
  content: `
    <p class="text-lg text-gray-700 mb-6">Investing is one of the most powerful ways to grow your wealth, achieve financial independence, and secure your future. Yet for many Kenyans, the idea of investing can feel intimidating or reserved for the wealthy. The truth is—anyone can start investing, no matter their income level. This guide will help you understand what investing is, why it matters, and how you can get started in Kenya.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">What is Investing?</h2>
    <p class="text-gray-700 mb-6">At its core, <strong>investing is putting your money into assets with the goal of making it grow.</strong> Instead of letting cash sit idle in a savings account (or worse, under the mattress), you put it into opportunities that can earn you returns over time.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Common forms of investing include:</h3>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Stocks (shares):</strong> Owning part of a company.</li>
      <li><strong>Bonds & Treasury bills:</strong> Lending money to the government or organizations and earning interest.</li>
      <li><strong>Real Estate:</strong> Buying land or property with the expectation of rental income or capital appreciation.</li>
      <li><strong>SACCOs & Chamas:</strong> Group investments that pool money and earn interest or returns.</li>
      <li><strong>Unit trusts & mutual funds:</strong> Professional fund managers invest on your behalf.</li>
    </ul>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Should You Invest?</h2>
    <p class="text-gray-700 mb-6">There are several compelling reasons to start investing:</p>
    <ol class="list-decimal list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Beat Inflation -</strong> Inflation in Kenya averages around 6–8% yearly, meaning your money loses value if it just sits idle. Investing helps you outpace inflation.</li>
      <li><strong>Build Wealth -</strong> Investments compound over time, growing your money without you working extra hours.</li>
      <li><strong>Achieve Financial Goals -</strong> Whether you want to buy a home, educate your children, or retire comfortably, investing helps you get there.</li>
      <li><strong>Passive Income -</strong> Some investments (like dividends, rental income, or interest) provide money even while you sleep.</li>
    </ol>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Principles of Smart Investing in Kenya</h2>
    <p class="text-gray-700 mb-4">Before you start, keep these rules in mind:</p>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Start Early & Small:</strong> Even KSh 500 invested today can grow over time. Don’t wait until you “have a lot.”</li>
      <li><strong>Diversify:</strong> Don’t put all your money in one basket. Spread across stocks, SACCOs, real estate, and treasury bills.</li>
      <li><strong>Research & Learn:</strong> Understand where your money goes—avoid “get-rich-quick” schemes that promise unrealistic returns.</li>
      <li><strong>Think Long-Term:</strong> Wealth building takes patience. Short-term speculation often leads to losses.</li>
      <li><strong>Set Clear Goals:</strong> Invest with purpose—whether for retirement, a business, or education.</li>
    </ul>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Start Investing in Kenya (Step-by-Step)</h2>
    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Get Financially Organized</h3>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li>Build an emergency fund (at least 3–6 months of expenses).</li>
      <li>Pay off high-interest debts (like mobile loans or credit cards).</li>
    </ul>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Choose an Investment Option</h3>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Government Securities (Treasury bills/bonds):</strong> Low-risk, available via CBK’s <em>Treasury Mobile Direct (TMD)</em>.</li>
      <li><strong>SACCOs & Money Market Funds (MMFs):</strong> Good for beginners; some MMFs allow starting with KSh 500.</li>
      <li><strong>Nairobi Securities Exchange (NSE):</strong> Buy shares of Kenyan companies via licensed stockbrokers or apps.</li>
      <li><strong>Real Estate:</strong> Land and housing projects, though capital-intensive, remain a strong option.</li>
      <li><strong>Chamas/Investment Groups:</strong> Good for collective investment power.</li>
    </ul>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Use Digital Platforms</h3>
    <p class="text-gray-700 mb-6">Kenya has fintech apps and platforms making investing more accessible. Examples include Money Market Fund apps (e.g., Sanlam, CIC, Britam), NSE mobile apps for stock trading, and mobile-based treasury bonds via <em>TMD</em>.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Monitor & Review</h3>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li>Track your investments regularly.</li>
      <li>Reinvest earnings (dividends/interest) instead of spending them.</li>
      <li>Adjust your portfolio as your goals change.</li>
    </ul>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Mistakes Beginners Make</h2>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Chasing quick profits</strong> through pyramid schemes or “shiny” investments.</li>
      <li><strong>Investing without research</strong> or blindly following friends.</li>
      <li><strong>Failing to diversify</strong>—relying on just one type of investment.</li>
      <li><strong>Ignoring risk</strong>—every investment has some risk; know your risk tolerance.</li>
    </ul>

    <div class="bg-green-50 border-l-4 border-green-400 p-6 my-8">
      <h3 class="text-lg font-semibold text-green-900 mb-2">Important Notice</h3>
      <p class="text-green-800 mb-3">This guide is for <strong>educational purposes only</strong> and should not be taken as professional financial advice. Investments carry risks, including the risk of losing your capital. Always:</p>
      <ol class="list-decimal list-inside text-green-800 space-y-1">
        <li>Do your own research before making investment decisions.</li>
        <li>Verify the credibility of platforms or institutions.</li>
        <li>Consider seeking advice from a licensed financial advisor.</li>
        <li>Invest only what you can afford to lose.</li>
      </ol>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
    <p class="text-gray-700 mb-6">Investing is not just for the rich—it’s for anyone who wants to grow their money and secure their future. In Kenya, opportunities range from government bonds and SACCOs to stocks and real estate. The key is to start early, stay consistent, and think long-term.</p>
    <p class="text-gray-700">The best time to start investing was yesterday. The second-best time is today.</p>
  `
},

    2: {
       title: "How to Evaluate SACCOs Before Investing Your Money",
  author: "Jane Doe",
  publishDate: "August 20, 2024",
  readTime: "10 min read",
  category: "Savings & Investments",
  image: "https://images.unsplash.com/photo-1588776814546-ec7f1b82f9ab?w=800&h=400&fit=crop",
  tags: ["SACCOs", "Kenya", "investing", "personal finance"],
  content: `
    <p class="text-lg text-gray-700 mb-6">In Kenya, SACCOs (Savings and Credit Cooperative Organizations) have become a trusted way for individuals to save, borrow, and invest. They offer better interest rates than banks, encourage a savings culture, and allow members to own shares in the cooperative. But not all SACCOs are created equal. Before committing your hard-earned money, it’s essential to evaluate whether a SACCO is safe, stable, and right for you.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Why SACCOs Are Popular in Kenya</h2>
    <p class="text-gray-700 mb-6">SACCOs are community-driven and member-owned, meaning profits are shared among members. They often provide loans at lower interest rates than banks and encourage disciplined savings. For many Kenyans, they’re the gateway to buying land, starting businesses, or paying school fees.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Factors to Consider Before Joining a SACCO</h2>
    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Registration & Regulation</h3>
    <p class="text-gray-700 mb-6">Ensure the SACCO is registered and regulated by the <strong>SACCO Societies Regulatory Authority (SASRA)</strong>. Regulated SACCOs must meet specific standards and are less likely to collapse due to mismanagement.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Financial Stability</h3>
    <p class="text-gray-700 mb-6">Check the SACCO’s financial statements, asset base, and loan portfolio. A strong SACCO should have steady growth in member deposits and healthy loan recovery rates.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Membership Requirements</h3>
    <p class="text-gray-700 mb-6">Some SACCOs are open to all Kenyans, while others are tied to professions (e.g., teachers, civil servants). Understand the joining fees, monthly contributions, and share capital requirements before signing up.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Loan Products & Interest Rates</h3>
    <p class="text-gray-700 mb-6">Compare how much you can borrow, repayment terms, and interest rates. Some SACCOs offer multipliers (e.g., borrow up to 3x your savings), while others have more conservative lending policies.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Dividends & Rebates</h3>
    <p class="text-gray-700 mb-6">A key benefit of SACCOs is the annual dividend payout on your shares. Look at past records—consistent payouts (10–20%) are a good sign of financial health and strong management.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Governance & Transparency</h3>
    <p class="text-gray-700 mb-6">Strong SACCOs have active Annual General Meetings (AGMs), audited accounts, and clear communication with members. Avoid SACCOs that hide information or delay reports.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">7. Technology & Accessibility</h3>
    <p class="text-gray-700 mb-6">Modern SACCOs use mobile apps and USSD services to make deposits, withdrawals, and loan applications easier. This convenience matters if you want to manage your money digitally.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Red Flags to Watch Out For</h2>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li>Unrealistic promises of very high returns.</li>
      <li>Lack of proper regulation or registration.</li>
      <li>Delayed or irregular dividend payments.</li>
      <li>Poor communication or lack of transparency in operations.</li>
    </ul>

    <div class="bg-red-50 border-l-4 border-red-400 p-6 my-8">
      <h3 class="text-lg font-semibold text-red-900 mb-2">Important Notice</h3>
      <p class="text-red-800 mb-3">This article is for educational purposes only. SACCO investments carry risks, including mismanagement and potential loss of funds. Always:</p>
      <ol class="list-decimal list-inside text-red-800 space-y-1">
        <li>Confirm that the SACCO is licensed by SASRA.</li>
        <li>Read and understand the SACCO’s by-laws before joining.</li>
        <li>Seek advice from experienced members or financial advisors.</li>
      </ol>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
    <p class="text-gray-700 mb-6">SACCOs can be a safe and rewarding investment option for Kenyans, offering both financial services and community support. However, due diligence is critical—choosing the wrong SACCO can lead to financial loss. Always evaluate registration, financial health, governance, and member benefits before joining.</p>
    <p class="text-gray-700">By asking the right questions and doing proper research, you can confidently select a SACCO that grows your savings and supports your long-term financial goals.</p>
  
      `
    },
    3: {
     title: "REITs in Kenya: Your Gateway to Real Estate Investing",
  author: "Jane Doe",
  publishDate: "September 5, 2024",
  readTime: "9 min read",
  category: "Real Estate",
  image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=400&fit=crop",
  tags: ["REITs", "real estate", "Kenya", "investing"],
  content: `
    <p class="text-lg text-gray-700 mb-6">Real estate has long been seen as a powerful way to build wealth in Kenya. However, buying land or property directly can be capital-intensive, often requiring millions of shillings. This is where <strong>Real Estate Investment Trusts (REITs)</strong> come in—offering everyday investors a chance to tap into the real estate market without needing huge sums of money.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a REIT?</h2>
    <p class="text-gray-700 mb-6">A Real Estate Investment Trust (REIT) is a regulated investment vehicle that pools money from multiple investors to buy, manage, and develop real estate assets. Investors then earn returns in the form of <em>rental income distributions</em> and potential <em>capital gains</em>.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Types of REITs in Kenya</h3>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Income REITs (I-REITs):</strong> Focus on rental income from properties such as malls, offices, and apartments.</li>
      <li><strong>Development REITs (D-REITs):</strong> Invest in real estate projects under construction with the aim of selling or leasing for profit.</li>
      <li><strong>Hybrid REITs:</strong> Combine both income-generating and development projects.</li>
    </ul>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Invest in REITs?</h2>
    <ol class="list-decimal list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Accessibility –</strong> Unlike buying land, you can start investing in REITs with as little as KSh 1,000 through the Nairobi Securities Exchange (NSE).</li>
      <li><strong>Diversification –</strong> Your money is spread across multiple properties, reducing risk.</li>
      <li><strong>Passive Income –</strong> REITs distribute most of their rental income to investors as dividends.</li>
      <li><strong>Liquidity –</strong> Since REITs are listed on the NSE, you can buy or sell units more easily than selling physical land or property.</li>
      <li><strong>Professional Management –</strong> Experts manage the properties, saving you the hassle of being a landlord.</li>
    </ol>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Invest in REITs in Kenya</h2>
    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Open a CDS Account</h3>
    <p class="text-gray-700 mb-6">You’ll need a Central Depository System (CDS) account to trade REIT units, just like with stocks.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Choose a Licensed Broker</h3>
    <p class="text-gray-700 mb-6">REITs are listed on the Nairobi Securities Exchange (NSE). Work with a licensed broker or investment bank to buy units.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Pick the Right REIT</h3>
    <p class="text-gray-700 mb-6">Currently, the most active REIT in Kenya is the <strong>ILAM Fahari I-REIT</strong>. Research performance, dividend history, and management before investing.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Monitor Your Investment</h3>
    <p class="text-gray-700 mb-6">Track dividends, market price changes, and announcements from the REIT’s management. Reinvesting dividends can accelerate your returns.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Risks to Keep in Mind</h2>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li>Property market downturns can reduce rental income and asset values.</li>
      <li>Low liquidity compared to stocks (few active REITs in Kenya).</li>
      <li>Regulatory and management risks if oversight is weak.</li>
    </ul>

    <div class="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
      <h3 class="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
      <p class="text-blue-800 mb-3">This article is for informational purposes only and does not constitute financial advice. REIT investments carry risks, and returns are not guaranteed. Always:</p>
      <ol class="list-decimal list-inside text-blue-800 space-y-1">
        <li>Do thorough research on the REIT’s performance and management.</li>
        <li>Invest only through licensed brokers and the NSE platform.</li>
        <li>Seek advice from a certified financial advisor before making commitments.</li>
      </ol>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
    <p class="text-gray-700 mb-6">REITs are a game-changer for Kenyans who want to invest in real estate without the high upfront costs. They provide accessibility, diversification, and professional management while generating passive income. However, like all investments, due diligence and patience are essential.</p>
    <p class="text-gray-700">If you’ve been eyeing real estate but can’t afford to buy property outright, REITs may be your gateway into this lucrative market.</p>
  `
    },
    4: {
     title: "Tax-Smart Investing Strategies for Kenyan Professionals",
  author: "Jane Doe",
  publishDate: "October 15, 2024",
  readTime: "11 min read",
  category: "Tax & Finance",
  image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?w=800&h=400&fit=crop",
  tags: ["tax", "Kenya", "investing", "finance", "professionals"],
  content: `
    <p class="text-lg text-gray-700 mb-6">Investing is not just about making money—it’s also about keeping more of what you earn. In Kenya, taxes can eat into your investment returns if you don’t plan wisely. For professionals such as doctors, engineers, teachers, IT experts, and entrepreneurs, adopting <strong>tax-smart investing strategies</strong> can help maximize wealth over time.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Tax Efficiency Matters</h2>
    <p class="text-gray-700 mb-6">When you invest, you may pay taxes on dividends, interest income, rental income, or capital gains. Over time, these taxes compound and reduce your overall returns. Tax-smart investing is about structuring your portfolio in a way that minimizes tax leakage while staying compliant with Kenya Revenue Authority (KRA) requirements.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Tax-Smart Investment Options in Kenya</h2>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Tax-Free Government Securities</h3>
    <p class="text-gray-700 mb-6">Interest earned from certain <strong>infrastructure bonds</strong> issued by the Government of Kenya is exempt from taxes. Professionals looking for low-risk, tax-free returns should consider these bonds through the CBK’s Treasury Mobile Direct (TMD) platform.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Retirement Savings (Pension Schemes)</h3>
    <p class="text-gray-700 mb-6">Contributions to registered retirement schemes are <strong>tax-deductible up to KSh 20,000 per month (or KSh 240,000 annually)</strong>. This means you lower your taxable income today while building a retirement nest egg.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Unit Trusts & Money Market Funds</h3>
    <p class="text-gray-700 mb-6">While interest from Money Market Funds is subject to a <strong>15% withholding tax</strong>, the convenience, liquidity, and higher returns compared to bank savings make them a smart choice. Choosing tax-efficient funds ensures you keep more of your earnings.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Real Estate Investment Trusts (REITs)</h3>
    <p class="text-gray-700 mb-6">REITs benefit from tax advantages under Kenyan law, as they are exempt from corporate tax if they distribute at least 80% of their income to investors. This structure helps professionals enjoy tax-efficient real estate exposure.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">5. SACCO Dividends & Rebates</h3>
    <p class="text-gray-700 mb-6">Dividends from SACCOs are subject to <strong>5% withholding tax</strong>, which is final tax. This makes SACCOs attractive compared to other investments taxed at higher rates.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Smart Strategies for Kenyan Professionals</h2>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Diversify Across Tax-Efficient Assets:</strong> Blend pensions, SACCOs, infrastructure bonds, and REITs for optimized tax outcomes.</li>
      <li><strong>Time Your Withdrawals:</strong> Plan when to liquidate investments, especially with capital gains or long-term holdings.</li>
      <li><strong>Use Retirement Accounts Fully:</strong> Max out pension contributions for the tax relief.</li>
      <li><strong>Reinvest Dividends & Interest:</strong> Compound your wealth tax-efficiently by reinvesting instead of withdrawing prematurely.</li>
    </ul>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Mistakes to Avoid</h2>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li>Ignoring pension tax reliefs and leaving money on the table.</li>
      <li>Over-investing in fully taxable assets like fixed deposits.</li>
      <li>Failing to keep proper investment records for tax filing.</li>
      <li>Withdrawing retirement savings early and facing penalties.</li>
    </ul>

    <div class="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
      <h3 class="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
      <p class="text-blue-800 mb-3">This article is for educational purposes only and should not be taken as professional tax advice. Tax laws may change, and strategies may vary depending on your personal circumstances. Always:</p>
      <ol class="list-decimal list-inside text-blue-800 space-y-1">
        <li>Consult a certified tax advisor or financial planner.</li>
        <li>Stay updated with Kenya Revenue Authority (KRA) guidelines.</li>
        <li>Invest within your risk tolerance and financial goals.</li>
      </ol>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
    <p class="text-gray-700 mb-6">For Kenyan professionals, tax-smart investing is about being strategic, not just about chasing the highest returns. By leveraging tax incentives, diversifying into efficient vehicles, and planning withdrawals carefully, you can maximize long-term wealth and financial security.</p>
    <p class="text-gray-700">Remember: it’s not just what you earn—it’s what you keep that matters most.</p>
  `
    },
    5: {
  title: "How to Evaluate SACCOs Before Investing Your Money",
  author: "Jane Doe",
  publishDate: "August 20, 2024",
  readTime: "10 min read",
  category: "Savings & Investments",
  image: "https://images.unsplash.com/photo-1588776814546-ec7f1b82f9ab?w=800&h=400&fit=crop",
  tags: ["SACCOs", "Kenya", "investing", "personal finance"],
  content: `
    <p class="text-lg text-gray-700 mb-6">In Kenya, SACCOs (Savings and Credit Cooperative Organizations) have become a trusted way for individuals to save, borrow, and invest. They offer better interest rates than banks, encourage a savings culture, and allow members to own shares in the cooperative. But not all SACCOs are created equal. Before committing your hard-earned money, it’s essential to evaluate whether a SACCO is safe, stable, and right for you.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Why SACCOs Are Popular in Kenya</h2>
    <p class="text-gray-700 mb-6">SACCOs are community-driven and member-owned, meaning profits are shared among members. They often provide loans at lower interest rates than banks and encourage disciplined savings. For many Kenyans, they’re the gateway to buying land, starting businesses, or paying school fees.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Factors to Consider Before Joining a SACCO</h2>
    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Registration & Regulation</h3>
    <p class="text-gray-700 mb-6">Ensure the SACCO is registered and regulated by the <strong>SACCO Societies Regulatory Authority (SASRA)</strong>. Regulated SACCOs must meet specific standards and are less likely to collapse due to mismanagement.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Financial Stability</h3>
    <p class="text-gray-700 mb-6">Check the SACCO’s financial statements, asset base, and loan portfolio. A strong SACCO should have steady growth in member deposits and healthy loan recovery rates.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Membership Requirements</h3>
    <p class="text-gray-700 mb-6">Some SACCOs are open to all Kenyans, while others are tied to professions (e.g., teachers, civil servants). Understand the joining fees, monthly contributions, and share capital requirements before signing up.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Loan Products & Interest Rates</h3>
    <p class="text-gray-700 mb-6">Compare how much you can borrow, repayment terms, and interest rates. Some SACCOs offer multipliers (e.g., borrow up to 3x your savings), while others have more conservative lending policies.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Dividends & Rebates</h3>
    <p class="text-gray-700 mb-6">A key benefit of SACCOs is the annual dividend payout on your shares. Look at past records—consistent payouts (10–20%) are a good sign of financial health and strong management.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Governance & Transparency</h3>
    <p class="text-gray-700 mb-6">Strong SACCOs have active Annual General Meetings (AGMs), audited accounts, and clear communication with members. Avoid SACCOs that hide information or delay reports.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">7. Technology & Accessibility</h3>
    <p class="text-gray-700 mb-6">Modern SACCOs use mobile apps and USSD services to make deposits, withdrawals, and loan applications easier. This convenience matters if you want to manage your money digitally.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Red Flags to Watch Out For</h2>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li>Unrealistic promises of very high returns.</li>
      <li>Lack of proper regulation or registration.</li>
      <li>Delayed or irregular dividend payments.</li>
      <li>Poor communication or lack of transparency in operations.</li>
    </ul>

    <div class="bg-red-50 border-l-4 border-red-400 p-6 my-8">
      <h3 class="text-lg font-semibold text-red-900 mb-2">Important Notice</h3>
      <p class="text-red-800 mb-3">This article is for educational purposes only. SACCO investments carry risks, including mismanagement and potential loss of funds. Always:</p>
      <ol class="list-decimal list-inside text-red-800 space-y-1">
        <li>Confirm that the SACCO is licensed by SASRA.</li>
        <li>Read and understand the SACCO’s by-laws before joining.</li>
        <li>Seek advice from experienced members or financial advisors.</li>
      </ol>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
    <p class="text-gray-700 mb-6">SACCOs can be a safe and rewarding investment option for Kenyans, offering both financial services and community support. However, due diligence is critical—choosing the wrong SACCO can lead to financial loss. Always evaluate registration, financial health, governance, and member benefits before joining.</p>
    <p class="text-gray-700">By asking the right questions and doing proper research, you can confidently select a SACCO that grows your savings and supports your long-term financial goals.</p>
  `
},
6: {
  title: "REITs in Kenya: Your Gateway to Real Estate Investing",
  author: "Jane Doe",
  publishDate: "September 5, 2024",
  readTime: "9 min read",
  category: "Real Estate",
  image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=400&fit=crop",
  tags: ["REITs", "real estate", "Kenya", "investing"],
  content: `
    <p class="text-lg text-gray-700 mb-6">Real estate has long been seen as a powerful way to build wealth in Kenya. However, buying land or property directly can be capital-intensive, often requiring millions of shillings. This is where <strong>Real Estate Investment Trusts (REITs)</strong> come in—offering everyday investors a chance to tap into the real estate market without needing huge sums of money.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">What is a REIT?</h2>
    <p class="text-gray-700 mb-6">A Real Estate Investment Trust (REIT) is a regulated investment vehicle that pools money from multiple investors to buy, manage, and develop real estate assets. Investors then earn returns in the form of <em>rental income distributions</em> and potential <em>capital gains</em>.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Types of REITs in Kenya</h3>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Income REITs (I-REITs):</strong> Focus on rental income from properties such as malls, offices, and apartments.</li>
      <li><strong>Development REITs (D-REITs):</strong> Invest in real estate projects under construction with the aim of selling or leasing for profit.</li>
      <li><strong>Hybrid REITs:</strong> Combine both income-generating and development projects.</li>
    </ul>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Invest in REITs?</h2>
    <ol class="list-decimal list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Accessibility –</strong> Unlike buying land, you can start investing in REITs with as little as KSh 1,000 through the Nairobi Securities Exchange (NSE).</li>
      <li><strong>Diversification –</strong> Your money is spread across multiple properties, reducing risk.</li>
      <li><strong>Passive Income –</strong> REITs distribute most of their rental income to investors as dividends.</li>
      <li><strong>Liquidity –</strong> Since REITs are listed on the NSE, you can buy or sell units more easily than selling physical land or property.</li>
      <li><strong>Professional Management –</strong> Experts manage the properties, saving you the hassle of being a landlord.</li>
    </ol>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">How to Invest in REITs in Kenya</h2>
    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Open a CDS Account</h3>
    <p class="text-gray-700 mb-6">You’ll need a Central Depository System (CDS) account to trade REIT units, just like with stocks.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Choose a Licensed Broker</h3>
    <p class="text-gray-700 mb-6">REITs are listed on the Nairobi Securities Exchange (NSE). Work with a licensed broker or investment bank to buy units.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Pick the Right REIT</h3>
    <p class="text-gray-700 mb-6">Currently, the most active REIT in Kenya is the <strong>ILAM Fahari I-REIT</strong>. Research performance, dividend history, and management before investing.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Monitor Your Investment</h3>
    <p class="text-gray-700 mb-6">Track dividends, market price changes, and announcements from the REIT’s management. Reinvesting dividends can accelerate your returns.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Risks to Keep in Mind</h2>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li>Property market downturns can reduce rental income and asset values.</li>
      <li>Low liquidity compared to stocks (few active REITs in Kenya).</li>
      <li>Regulatory and management risks if oversight is weak.</li>
    </ul>

    <div class="bg-blue-50 border-l-4 border-blue-400 p-6 my-8">
      <h3 class="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
      <p class="text-blue-800 mb-3">This article is for informational purposes only and does not constitute financial advice. REIT investments carry risks, and returns are not guaranteed. Always:</p>
      <ol class="list-decimal list-inside text-blue-800 space-y-1">
        <li>Do thorough research on the REIT’s performance and management.</li>
        <li>Invest only through licensed brokers and the NSE platform.</li>
        <li>Seek advice from a certified financial advisor before making commitments.</li>
      </ol>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
    <p class="text-gray-700 mb-6">REITs are a game-changer for Kenyans who want to invest in real estate without the high upfront costs. They provide accessibility, diversification, and professional management while generating passive income. However, like all investments, due diligence and patience are essential.</p>
    <p class="text-gray-700">If you’ve been eyeing real estate but can’t afford to buy property outright, REITs may be your gateway into this lucrative market.</p>
  `
},
7: {
  title: "Tax-Smart Investing Strategies for Kenyan Professionals",
  author: "Jane Doe",
  publishDate: "October 15, 2024",
  readTime: "11 min read",
  category: "Tax & Finance",
  image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?w=800&h=400&fit=crop",
  tags: ["tax", "Kenya", "investing", "finance", "professionals"],
  content: `
    <p class="text-lg text-gray-700 mb-6">Investing is not just about making money—it’s also about keeping more of what you earn. In Kenya, taxes can eat into your investment returns if you don’t plan wisely. For professionals such as doctors, engineers, teachers, IT experts, and entrepreneurs, adopting <strong>tax-smart investing strategies</strong> can help maximize wealth over time.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Tax Efficiency Matters</h2>
    <p class="text-gray-700 mb-6">When you invest, you may pay taxes on dividends, interest income, rental income, or capital gains. Over time, these taxes compound and reduce your overall returns. Tax-smart investing is about structuring your portfolio in a way that minimizes tax leakage while staying compliant with Kenya Revenue Authority (KRA) requirements.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Tax-Smart Investment Options in Kenya</h2>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Tax-Free Government Securities</h3>
    <p class="text-gray-700 mb-6">Interest earned from certain <strong>infrastructure bonds</strong> issued by the Government of Kenya is exempt from taxes. Professionals looking for low-risk, tax-free returns should consider these bonds through the CBK’s Treasury Mobile Direct (TMD) platform.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Retirement Savings (Pension Schemes)</h3>
    <p class="text-gray-700 mb-6">Contributions to registered retirement schemes are <strong>tax-deductible up to KSh 20,000 per month (or KSh 240,000 annually)</strong>. This means you lower your taxable income today while building a retirement nest egg.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Unit Trusts & Money Market Funds</h3>
    <p class="text-gray-700 mb-6">While interest from Money Market Funds is subject to a <strong>15% withholding tax</strong>, the convenience, liquidity, and higher returns compared to bank savings make them a smart choice. Choosing tax-efficient funds ensures you keep more of your earnings.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Real Estate Investment Trusts (REITs)</h3>
    <p class="text-gray-700 mb-6">REITs benefit from tax advantages under Kenyan law, as they are exempt from corporate tax if they distribute at least 80% of their income to investors. This structure helps professionals enjoy tax-efficient real estate exposure.</p>

    <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">5. SACCO Dividends & Rebates</h3>
    <p class="text-gray-700 mb-6">Dividends from SACCOs are subject to <strong>5% withholding tax</strong>, which is final tax. This makes SACCOs attractive compared to other investments taxed at higher rates.</p>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Smart Strategies for Kenyan Professionals</h2>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li><strong>Diversify Across Tax-Efficient Assets:</strong> Blend pensions, SACCOs, infrastructure bonds, and REITs for optimized tax outcomes.</li>
      <li><strong>Time Your Withdrawals:</strong> Plan when to liquidate investments, especially with capital gains or long-term holdings.</li>
      <li><strong>Use Retirement Accounts Fully:</strong> Max out pension contributions for the tax relief.</li>
      <li><strong>Reinvest Dividends & Interest:</strong> Compound your wealth tax-efficiently by reinvesting instead of withdrawing prematurely.</li>
    </ul>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Common Mistakes to Avoid</h2>
    <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
      <li>Ignoring pension tax reliefs and leaving money on the table.</li>
      <li>Over-investing in fully taxable assets like fixed deposits.</li>
      <li>Failing to keep proper investment records for tax filing.</li>
      <li>Withdrawing retirement savings early and facing penalties.</li>
    </ul>

    <div class="bg-purple-50 border-l-4 border-purple-400 p-6 my-8">
      <h3 class="text-lg font-semibold text-purple-900 mb-2">Important Notice</h3>
      <p class="text-purple-800 mb-3">This article is for educational purposes only and should not be taken as professional tax advice. Tax laws may change, and strategies may vary depending on your personal circumstances. Always:</p>
      <ol class="list-decimal list-inside text-purple-800 space-y-1">
        <li>Consult a certified tax advisor or financial planner.</li>
        <li>Stay updated with Kenya Revenue Authority (KRA) guidelines.</li>
        <li>Invest within your risk tolerance and financial goals.</li>
      </ol>
    </div>

    <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
    <p class="text-gray-700 mb-6">For Kenyan professionals, tax-smart investing is about being strategic, not just about chasing the highest returns. By leveraging tax incentives, diversifying into efficient vehicles, and planning withdrawals carefully, you can maximize long-term wealth and financial security.</p>
    <p class="text-gray-700">Remember: it’s not just what you earn—it’s what you keep that matters most.</p>
  `
}


  };

  const post = blogPosts[id] || blogPosts[1]; // Default to first post if ID not found

  const relatedPosts = [
    { id: 2, title: "How to Evaluate SACCOs Before Investing Your Money", category: "Saccos" },
    { id: 3, title: "Getting Started with Stocks: A Beginner's Guide", category: "Stocks" },
    { id: 4, title: "Real Estate Investment in Kenya: Opportunities and Challenges", category: "Real Estate" }
  ].filter(p => p.id != id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white shadow-sm sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            to="/learning-hub"
            className="inline-flex items-center text-primary hover:text-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Hub
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.publishDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Bookmark className="h-4 w-4" />
              Save
            </button>
            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <ThumbsUp className="h-4 w-4" />
              Like
            </button>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </header>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {post.author.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{post.author}</h3>
              <p className="text-gray-600">
                Investment strategist with over 10 years of experience in portfolio management and financial planning. 
                Passionate about helping investors make informed decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.id}`}
                className="group"
              >
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <span className="text-sm text-primary font-medium">{relatedPost.category}</span>
                  <h4 className="font-semibold text-gray-900 mt-1 group-hover:text-primary transition-colors">
                    {relatedPost.title}
                  </h4>
                  <div className="flex items-center text-primary mt-2">
                    <span className="text-sm">Read more</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Discussion
          </h3>
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Be the first to start the conversation!</p>
            <button className="mt-3 bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors">
              Add Comment
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;

import { NextRequest, NextResponse } from 'next/server';
import { searchJobs, searchBusinessOpportunities, explainJobEligibility } from '@/services/jarvisTools';

export async function POST(req: NextRequest) {
  try {
    const { query, language = 'auto', conversationHistory = [] } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const q = query.trim().toLowerCase();

    // Intent 1: Electrician in Aligarh / Local jobs
    if (q.includes('electrician') || q.includes('bijli') || (q.includes('aligarh') && q.includes('job'))) {
      const { results } = await searchJobs({ keyword: 'electrician', location: 'aligarh' });

      const replyHindi =
        'Certainly! Main aapke liye electrician ki verified opportunities search kar raha hoon. ' +
        'Aligarh zone mein UPPTCL NAPS Apprenticeship Cell ki official vacancy verified hai (stipend ₹8,500 - ₹10,200). ' +
        'Aap nearby local work chahte hain ya company mein full-time apprenticeship?';

      return NextResponse.json({
        reply: replyHindi,
        spokenText: 'Main aapke liye electrician ki verified opportunities search kar raha hoon. Aligarh zone mein UPPTCL apprenticeship verified hai. Aap local work chahte hain ya full-time job?',
        intent: 'job_search',
        results: results,
        suggestedActions: [
          { label: 'View UPPTCL Apprenticeship', action: 'navigate_job', target: 'job-ncs-01' },
          { label: 'Explore Solar PV Training', action: 'navigate_job', target: 'job-ncs-03' },
        ],
      });
    }

    // Intent 2: Business without money / Zero-rent startup
    if (
      q.includes('paise nahi') ||
      q.includes('paisa nahi') ||
      q.includes('no money') ||
      q.includes('business start') ||
      q.includes('shop nahi') ||
      q.includes('dukan')
    ) {
      const { results } = await searchBusinessOpportunities({ category: 'scheme' });

      const replyHindi =
        'Samajh gaya! Agar aapke paas physical shop rent karne ke paise nahi hain, to pareshan hone ki zaroorat nahi hai. ' +
        'KAAMSETU par aap bina kisi kiraye ke apni "Digital Dukaan" bana sakte hain. ' +
        'Iske alawa, PM Vishwakarma Yojana mein ₹15,000 ka free toolkit incentive aur ₹3,00,000 tak ka 5% interest collateral-free loan milta hai. ' +
        'Pehle mujhe apna skill bataiye — aap kis kaam mein mahir hain?';

      return NextResponse.json({
        reply: replyHindi,
        spokenText: 'Samajh gaya. Agar physical shop ke paise nahi hain, to aap bina kiraye ke digital dukaan bana sakte hain. Pehle mujhe apna skill bataiye, hum zero investment opportunities search karenge.',
        intent: 'business_guidance',
        results: results,
        suggestedActions: [
          { label: 'Open Digital Dukaan', action: 'navigate_module', target: 'business_hub' },
          { label: 'Check PM Vishwakarma Eligibility', action: 'navigate_module', target: 'opportunities' },
        ],
      });
    }

    // Intent 3: General Job Search
    if (q.includes('job') || q.includes('naukri') || q.includes('kaam') || q.includes('vacancy')) {
      const keyword = q.replace(/job|naukri|kaam|vacancy|chahiye|dhoondo/g, '').trim();
      const { results, count } = await searchJobs({ keyword: keyword || undefined });

      if (count === 0) {
        return NextResponse.json({
          reply: `Mujhe "${keyword}" ke liye abhi koi verified vacancy nahi mili. KAAMSETU par hum unverified ya fake listings display nahi karte. Kripya related skills ya location badal kar dekhein.`,
          spokenText: `Mujhe is skill ke liye koi verified vacancy nahi mili. Hum kewal verified data dikhate hain.`,
          intent: 'job_search',
          results: [],
        });
      }

      return NextResponse.json({
        reply: `Humare verified database mein ${count} vacancies mili hain jo official government portal ya verified employer dwara published hain:`,
        spokenText: `Aapke liye ${count} verified opportunities mili hain. Details screen par dekhein.`,
        intent: 'job_search',
        results: results,
      });
    }

    // Intent 4: Government schemes and opportunities
    if (q.includes('scheme') || q.includes('yojana') || q.includes('sarkari') || q.includes('loan')) {
      const { results } = await searchBusinessOpportunities({});
      return NextResponse.json({
        reply: 'Yeh hain verified Central aur State government schemes jo bina collateral aur zero upfront fee ke artisans aur micro-entrepreneurs ko support karti hain:',
        spokenText: 'Verified government schemes screen par display ho rahi hain.',
        intent: 'scheme_search',
        results: results,
        suggestedActions: [
          { label: 'PM Vishwakarma Portal', action: 'open_url', target: 'https://pmvishwakarma.gov.in' },
          { label: 'Mudra Scheme Portal', action: 'open_url', target: 'https://www.mudra.org.in' },
        ],
      });
    }

    // Default conversational response
    return NextResponse.json({
      reply:
        'Namaste! Main KAAMSETU JARVIS hoon. Main aapki employment, verified job search, digital skill profile, aur zero-rent business start karne mein madad kar sakta hoon. ' +
        'Aap Hindi ya English mein batayein: aap kya dhoondh rahe hain?',
      spokenText: 'Namaste! Main KAAMSETU JARVIS hoon. Aap apni skill ya job requirement bataiye, main verified opportunities search karunga.',
      intent: 'general_help',
      suggestedActions: [
        { label: 'Search Electrician Jobs in Aligarh', action: 'query', target: 'Electrician jobs in Aligarh' },
        { label: 'Start Business Without Money', action: 'query', target: 'Mere paas paise nahi hain business start karna hai' },
      ],
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

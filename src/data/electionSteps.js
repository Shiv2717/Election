import { FileText, Megaphone, Users, CheckCircle, Trophy } from 'lucide-react';

export const electionSteps = [
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: 'FileText',
    shortDesc: 'Get on the electoral roll to exercise your right.',
    details: 'To vote in India, you must be an Indian citizen, 18 years or older on the qualifying date (usually Jan 1st), and a resident of the polling area. You need to fill out Form 6 online via the Voter Portal or offline to get your Electoral Photo Identity Card (EPIC).',
    timeline: 'Months before the election',
    resources: [
      { title: 'NVSP Portal', url: 'https://voters.eci.gov.in/', desc: 'Register to vote or check your status.' },
      { title: 'Form 6 Guidelines', url: '#', desc: 'Step-by-step guide to filling Form 6.' }
    ]
  },
  {
    id: 'announcement',
    title: 'Election Announcement',
    icon: 'Megaphone',
    shortDesc: 'The Election Commission declares the schedule.',
    details: 'The Election Commission of India (ECI) announces the election dates. Immediately, the Model Code of Conduct (MCC) comes into effect to ensure free and fair elections. Political parties begin finalizing their candidates.',
    timeline: 'Approx. 45-60 days before polling',
    calendarEvent: {
      text: 'Election Announcement Expected',
      dates: '20260301T090000Z/20260301T100000Z',
      details: 'Check ECI website for the official election schedule.'
    },
    resources: [
      { title: 'Understanding MCC', url: '#', desc: 'What is the Model Code of Conduct?' }
    ]
  },
  {
    id: 'campaigning',
    title: 'Campaigning',
    icon: 'Users',
    shortDesc: 'Parties present their manifestos and rally for support.',
    details: 'Candidates file their nominations and begin campaigning. They hold rallies, distribute pamphlets, and release election manifestos. All campaigning must stop 48 hours before the polling day (the silence period).',
    timeline: 'Ends 48 hours prior to polling',
    resources: [
      { title: 'Know Your Candidate (KYC)', url: 'https://affidavit.eci.gov.in/', desc: 'Check candidate affidavits and backgrounds.' }
    ]
  },
  {
    id: 'voting',
    title: 'Voting Day',
    icon: 'CheckCircle',
    shortDesc: 'Cast your vote using EVMs at your designated booth.',
    details: 'Voters go to their designated polling stations. After identity verification, indelible ink is applied to the left index finger. Votes are cast using Electronic Voting Machines (EVMs), and a VVPAT slip confirms the vote was recorded correctly.',
    timeline: 'Polling Day (Single or Multiple Phases)',
    calendarEvent: {
      text: 'Voting Day',
      dates: '20260415T070000Z/20260415T180000Z',
      details: 'Don\'t forget your Voter ID! Go out and vote.'
    },
    mapQuery: 'Polling Station Near Me',
    youtubeId: 'v_zS1X5035Q', // Placeholder EVM Explainer (Using a standard YouTube video ID if available, otherwise just random)
    resources: [
      { title: 'Find Polling Booth', url: 'https://electoralsearch.eci.gov.in/', desc: 'Search for your name in the electoral roll.' }
    ]
  },
  {
    id: 'results',
    title: 'Counting & Results',
    icon: 'Trophy',
    shortDesc: 'Votes are counted and the winners are declared.',
    details: 'On the scheduled counting day, EVMs are opened under strict security and supervision. Votes are tallied, and the candidate with the highest valid votes in a constituency is declared the winner. The party or coalition with a majority forms the government.',
    timeline: 'Usually a few days after final polling',
    calendarEvent: {
      text: 'Election Results Day',
      dates: '20260501T080000Z/20260501T200000Z',
      details: 'Watch the live counting of votes.'
    },
    resources: [
      { title: 'ECI Results Portal', url: 'https://results.eci.gov.in/', desc: 'Live counting trends and results.' }
    ]
  }
];

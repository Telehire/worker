import {Icon} from "@iconify/react";

interface cardInfoType {
  url: string,
  index: string,
  title: string,
  desc: string
}
export const flowPathData:cardInfoType[] = [
  {
    url: '/images/home/case/file-icon.png',
    index: '01',
    title: 'Contract establishment',
    desc: 'HR enters employee and salary information into the system and successfully creates a contract'
  },
  {
    url: '/images/home/case/member-icon.png',
    index: '02',
    title: 'Invite employees to register',
    desc: 'Invite employees to complete the self-onboarding process and complete real-name certification information'
  },
  {
    url: '/images/home/case/pen-icon.png',
    index: '03',
    title: 'Sign the contract',
    desc: 'The platform and employees remotely sign an electronic employment contract with legal effect'
  },
  {
    url: '/images/home/case/card-icon.png',
    index: '04',
    title: 'Official onboarding',
    desc: 'Employees complete onboarding and start working for the company'
  },
  {
    url: '/images/home/case/dollor1-icon.png',
    index: '05',
    title: 'Continuous payroll',
    desc: 'The platform continues to follow up on payroll and HR services after employee onboarding'
  },
]

export const partTimeFlowPathData:cardInfoType[] = [
  {
    url: '/images/home/case/member-icon.png',
    index: '01',
    title: 'Invite contractors',
    desc: 'Invite contractors to complete real-name authentication remotely'
  },
  {
    url: '/images/home/case/file-icon.png',
    index: '02',
    title: 'Sign the contract',
    desc: 'Use our localized compliant contract or bring your own contract to sign with the contractor'
  },
  {
    url: '/images/home/case/dollor2-icon.png',
    index: '03',
    title: 'Submit invoices',
    desc: 'Your contractors submit invoices remotely'
  },
  {
    url: '/images/home/case/dollor1-icon.png',
    index: '04',
    title: 'Bulk payment',
    desc: 'Approve invoices and pay all your contractors remotely'
  },
  {
    url: '/images/home/case/dollor3-icon.png',
    index: '05',
    title: 'Contractors receive compensation',
    desc: 'Remotely pay your contractors in local currency'
  },
]

// ** React Imports
import { ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// ** MUI Components
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** View Imports
import Tips from 'src/views/home/Tips'
import Nav from 'src/views/home/Nav'
import Banner from 'src/views/home/Banner'
import NationalPolicy from 'src/views/home/Resource/NationalPolicy/index'
import Footer from 'src/views/home/Footer'
import DialogRequestDemo from 'src/views/components/dialogs/DialogRequestDemo'
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";


const defaultValue: {url: string, insideUrl: string,title: string,currency: string,lng: string, capital?: string, cycle?: string}[] = [
  {
    url: '/images/home/resource/Mask group (3).png',
    insideUrl: '/images/home/resource/flag1.png',
    title: 'Singapore',
    currency: 'Singapore Dollar (S$,SGD)',
    lng: 'English, Chinese and Malay Tamil',
    capital: 'Singapore city',
    cycle: 'Monthly'
  },
  {
    url: '/images/home/resource/Mask group (4).png',
    insideUrl: '/images/home/resource/flag9.png',
    title: 'Hong Kong',
    currency: 'Hong Kong dollar (HK$, HKD)',
    lng: 'English (official), Chinese (official), Cantonese',
    cycle: 'Monthly'
  },
  {
    url: '/images/home/resource/Mask group (5).png',
    insideUrl: '/images/home/resource/flag8.png',
    title: 'Taiwan',
    currency: 'New Taiwan Dollar (NT$, TWD)',
    lng: 'traditional Chinese',
    cycle: 'Monthly'
  },
  {
    url: '/images/home/resource/Mask group (6).png',
    insideUrl: '/images/home/resource/flag7.png',
    title: 'U.S.',
    currency: 'US dollar (USD)',
    lng: 'English',
    capital: 'Washington D.C.',
    cycle: 'Weekly, biweekly, or monthly'
  },
  {
    url: '/images/home/resource/Mask group (7).png',
    insideUrl: '/images/home/resource/flag6.png',
    title: 'Thailand',
    currency: 'Thai Baht (THB)',
    lng: 'Thai',
    capital: 'Bangkok',
    cycle: 'Monthly'
  },
  {
    url: '/images/home/resource/Mask group (8).png',
    insideUrl: '/images/home/resource/flag5.png',
    title: 'Japan',
    currency: 'Japanese Yen (Ұ, JPY)',
    lng: 'Japanese',
    capital: 'Tokyo',
    cycle: 'Monthly'
  },
  {
    url: '/images/home/resource/Mask group (9).png',
    insideUrl: '/images/home/resource/flag4.png',
    title: 'United Arab Emirates',
    currency: 'Dirham (DH, Dhs)',
    lng: 'Arabic, English',
    capital: 'Abu Dhabi',
    cycle: 'Monthly'
  },
  {
    url: '/images/home/resource/Mask group (10).png',
    insideUrl: '/images/home/resource/flag3.png',
    title: 'China',
    currency: 'Renminbi (¥, CNY)',
    lng: 'Simplified Chinese',
    capital: 'Beijing',
    cycle: 'Monthly'
  },
  {
    url: '/images/home/resource/Mask group (11).png',
    insideUrl: '/images/home/resource/flag1.png',
    title: 'South Korea',
    currency: 'South Korean Won (₩, KRW)',
    lng: 'Korean',
    capital: 'Seoul',
    cycle: 'Monthly'
  }
]

const countryContentList: {
  entry: string,
  salary: string,
  workTime: string,
  bonus: string,
  contract: string,
  holidayWithSalary: string,
  sickLeave: string,
  maternityLeaveAndPaternityLeave: string,
  individualIncomeTax: string,
  employerCosts: string,
  holiday: string,
  stopContract: string,
  insurance: string,
}[] = [
  {
    // 新加坡
    entry: 'After the company has signed the employee\'s job scope agreement and paid the deposit, the employee\'s onboarding can be completed within 2 working days.',
    salary: 'Among the working population in Singapore, the group earning SGD 2,500 to SGD 4,000 per month accounts for a large proportion and is considered the main workforce. In 2020, the average salary in Singapore was SGD 4,534.',
    workTime: 'The standard working hours are 44 hours per week, working five to six days a week with eight hours per day.',
    bonus: 'It is required by law to pay employees an additional 15 days of salary in June and December as a semi-annual bonus (prima de servicios), which can be understood as a 13-month salary.',
    contract: 'Singapore does not mandate the signing of labor contracts, but we recommend signing one with employees and clearly stating matters such as bonuses, working hours, termination clauses, and job responsibilities under compliance with local labor laws.',
    holidayWithSalary: 'After working for 12 months, employees are entitled to seven days of annual leave, followed by an additional day of annual leave for each year of service, up to a maximum of 14 days of annual leave after working for eight years. However, according to local customs, companies provide 14 days of annual leave benefits to employees upon employment. Employees who have worked for three to 12 months are entitled to proportional annual leave.',
    sickLeave: 'After three months of work, employees are entitled to paid sick leave, and after six months of service, they are entitled to full pay sick leave. Employees who have worked for six months are entitled to 60 days of paid hospitalization leave, including 14 days of paid outpatient leave. Employees who have worked for three to six months are entitled to proportional sick leave benefits.',
    maternityLeaveAndPaternityLeave: 'Female employees are entitled to 12 or 16 weeks of maternity leave, depending on whether the child is a Singaporean citizen. If a female employee has worked for the company continuously for at least three months before giving birth and the child is a Singaporean citizen, she is entitled to 16 weeks of maternity leave. Married female employees can transfer up to four weeks of maternity leave to their spouse. If the child\'s father meets certain criteria for paternity leave, he is entitled to two weeks of paid paternity leave.',
    individualIncomeTax: 'For an annual taxable income not exceeding SGD 30,000, the tax rate is 5%.For an annual taxable income exceeding SGD 30,000 but not exceeding SGD 90,000, the tax rate is 10%.For an annual taxable income exceeding SGD 90,000 but not exceeding SGD 300,000, the tax rate is 20%. For an annual taxable income exceeding SGD 300,000 but not exceeding SGD 500,000, the tax rate is 30%.',
    employerCosts: 'Employer costs are generally estimated to be 18.55% of employee wages. ',
    stopContract: 'Notice periods range from one day to four weeks. Currently, there are no regulations regarding severance pay unless otherwise specified in the employment contract.',
    holiday: 'New Year\'s Day, Chinese New Year (two days), Good Friday, Labor Day, Vesak Day, Hari Raya Puasa, National Day, Hari Raya Haji, Deepavali, Christmas Day."',
    insurance: 'Singapore provides a central provident fund, and employers need to pay the amount of the central provident fund for employees, which is equivalent to 7.5% to 17% of the total monthly salary'
  },
  {
    // 香港
    entry: 'On TeleHire, after a company signs an employee\'s job scope agreement and pays the deposit, the employee can start working within two working days.',
    salary: 'Hong Kong’s statutory minimum wage is HK$40 per hour; median income is HK$15,000',
    workTime: 'There is no fixed working hours in Hong Kong, as the working hours of an employee depend on their position and industry. However, employees typically work 44 hours per week. The working hours, days, rest time, and overtime hours should be detailed in the employment contract.',
    bonus: 'In addition to normal salary payments, companies are not obligated to pay bonuses, but usually offer 13th-month bonuses and performance bonuses.',
    contract: 'In Hong Kong, employment contracts can be presented in either verbal or written form. A written employment contract should include the names of the company and the employee, the company address and place of work, salary amount, payment intervals and any bonuses, vacation and other leave entitlements, contract period (if fixed-term), probationary period (if applicable), notice period and other requirements related to the termination of the employment contract. In addition to normal salary payments, companies are not obligated to pay bonuses, but usually offer 13th-month bonuses and performance bonuses.',
    holidayWithSalary: 'Employees are entitled to seven days of paid annual leave after one year of continuous employment, which increases by one day each year until they have worked for nine years and are entitled to 14 days of leave. ',
    sickLeave: 'Unused vacation days can be carried forward to the following year. Employees are entitled to two sick leave days per month, which increases to four days per month after the first year, with a maximum of 120 days.',
    maternityLeaveAndPaternityLeave: 'Female employees are entitled to 10 weeks of maternity leave related to childbirth. They can take two to four weeks of leave before giving birth and the remainder after giving birth. Maternity leave can be extended for various reasons, including pregnancy or childbirth complications. To be eligible for maternity leave, employees must have worked for at least 40 weeks and worked at least 18 hours per week. If a pregnant employee does not meet these conditions, they can still take maternity leave, but the leave period will be shorter. If a male employee has been employed for at least 40 weeks under a continuous contract and is the father or expectant father of a newborn baby, they can enjoy five days of paternity leave by notifying the company within a specified time.',
    individualIncomeTax: 'Hong Kong\'s salary tax, also known as personal tax, has rates of 2%, 6%, 10%, 14%, and 17%. The progressive tax rate is based on an individual\'s taxable net income, following a five-tier income percentage structure or a flat tax rate of 15% on net income after deducting exemptions. ',
    employerCosts: 'Employer costs are generally estimated at 5% of employee wages.',
    stopContract: 'When the contract expires (if it is fixed-term), the company or employee can unilaterally terminate the employment relationship for any reason or no reason. The company or employee can...',
    holiday: 'Hong Kong has both public and private healthcare systems, and companies usually provide medical insurance. ',
    insurance: 'In Hong Kong, there are both public and private healthcare systems. Employers usually provide medical insurance.'
   },
  {
    // 台湾
    entry: 'On TeleHire, after a company signs an employee\'s job scope agreement and pays the deposit, the employee can start working within two working days.',
    salary: 'Starting from January 2023, the monthly minimum wage in Taiwan is 26,400 New Taiwan Dollars, and the hourly minimum wage is 176 New Taiwan Dollars.',
    workTime: 'In Taiwan, the regular working hours for employees are 8 hours per day and 40 hours per week.',
    bonus: ' In addition to regular pay, companies are not obligated to provide bonuses, but it is common to offer 13th-month bonuses and performance-based bonuses.',
    contract: 'In most cases, labor contracts are also signed in written form, and all employment terms and conditions are agreed upon. The labor contract can be a fixed-term or an indefinite-term employment contract.',
    holidayWithSalary: 'Regarding the notice period, the employer must provide the following notice period based on the employee\'s length of service with the company:3 months to 1 year: 10 days1-3 years: 20 daysOver 3 years: 30 daysThe standard for severance pay is one-half month\'s salary for each year of service, up to a maximum of six months\' salary (calculated based on the annual salary).',
    sickLeave: 'Regular sick leave within one year cannot exceed 30 days. During the 30 days of regular sick leave, the employee will receive 50% of their normal salary paid by the employer, and the other 50% will come from the government\'s labor insurance fund.',
    maternityLeaveAndPaternityLeave: 'Women can enjoy eight weeks of maternity leave.',
    individualIncomeTax: 'The tax year in Taiwan is from January 1st to December 31st. Payment channel: direct deduction from wages. Of course, like most places in mainland China/Hong Kong and the world, there are non-resident taxpayers (staying in Taiwan for less than or equal to 183 days in the tax year) and resident taxpayers (staying in Taiwan for more than 183 days in the tax year).',
    employerCosts: 'Employer costs are generally estimated at 18% of employee wages.',
    stopContract: 'Regarding the notice period, the employer must provide the following notice period based on the employee\'s length of service with the company:3 months to 1 year: 10 days1-3 years: 20 daysOver 3 years: 30 daysThe standard for severance pay is one-half month\'s salary for each year of service, up to a maximum of six months\' salary (calculated based on the annual salary).',
    holiday: 'There are several public holidays in Taiwan, including New Year\'s Day, Republic of China Founding Day, Lunar New Year, Children\'s Day, Tomb Sweeping Day, Labor Day, Dragon Boat Festival, Mid-Autumn Festival, and National Day of the Republic of China.',
    insurance: 'Taiwan\'s social security system consists of two subjects, namely labor insurance and national health insurance (also known as \"labor insurance\" and \"health insurance\").'
  },
  {
    // 美国
    entry: 'On TeleHire, after a company signs an employee\'s job scope agreement and pays the deposit, the employee can start working within two working days.',
    salary: 'The average wage in the United States is $43,460 per year, with an average hourly wage of $20.9. The average monthly income for Americans is $3,000.',
    workTime: 'The income level of residents varies by state, with the federal minimum wage set at $7.25 per hour and higher rates in more developed areas, with some exceeding $10 per hour. A person working 8 hours a day for 21 days a month should make at least over $1,000 in wages. Work hours should be calculated based on a workweek, which does not necessarily have to align with the calendar week. It can start on any day and at any time during the day. Employers can set up different workweeks for different employees or groups of employees.',
    bonus: 'In addition to regular pay, companies are not obligated to provide bonuses, but there are typically 13th-month bonuses and performance-based bonuses.',
    contract: 'In the United States, laws governing employment relationships come from federal, state, and local regulations, as well as case law, and there are no mandatory requirements for hiring, which allows for flexibility for both employers and employees. Depending on the situation, there may be a labor contract signed. Contract types are divided into fixed-term, indefinite-term, or project-based, and the type of contract signed is determined through negotiation between both parties. Employee benefits fall into two types: those required by law and those provided voluntarily by employers. The U.S. Bureau of Labor Statistics specifies that \"statutory benefits should provide employees and their families with retirement income and medical care, ease economic hardship caused by unemployment or disability, and compensate for debts incurred due to work-related injuries or illnesses.\" Mandatory basic benefits include social security, national old-age medical insurance system, and the Federal Insurance Contributions Act (FICA), unemployment insurance, worker compensation insurance, and family medical leave.',
    holidayWithSalary: 'Employees are entitled to 15 paid vacation days per year.',
    sickLeave: 'If a sick leave exceeds three days, a doctor\'s note is required.',
    maternityLeaveAndPaternityLeave: 'According to the law, mothers of newborn or adopted children working for companies with 50 or more employees are entitled to up to 12 weeks of unpaid leave per year.',
    individualIncomeTax: 'Income tax is collected at both the federal and state levels, and an individual\'s total tax liability depends on the state and city where they reside or work. American taxpayers must file tax returns with the Internal Revenue Service (IRS) every year. ',
    employerCosts: 'The employer\'s cost is generally estimated to be around 10% of the employee\'s salary. ',
    stopContract: 'The employment relationship can be terminated by either party, with or without cause, and with or without notice. In the case of notice given by the employer, there is no formal \"notice period\" requirement under US law for individual terminations, except in certain cases of collective dismissals.',
    holiday: 'New Year\'s Day, Washington\'s Birthday, Memorial Day, Independence Day, Labor Day, Columbus Day, Veterans Day, Thanksgiving Day, Christmas Day',
    insurance: 'Employee benefits can be divided into statutory benefits and voluntary benefits. Statutory benefits refer to benefits that employers must provide to employees according to legal requirements, including social security, national old-age medical insurance system, and the Federal Insurance Contributions Act (FICA), unemployment insurance, worker compensation insurance, and family medical leave. These benefits are designed to help employees and their families alleviate economic pressures in situations such as retirement, unemployment, illness, and work-related injuries.'
  },
  {
    // 泰国
    entry: 'On TeleHire, after a company signs an employee\'s job scope agreement and pays the deposit, the employee can start working within two working days.',
    salary: 'In Thailand, the minimum wage varies by region, ranging from 313 to 336 Thai baht per day.',
    workTime: 'In Thailand, the normal working hours for employees are eight hours per day and 48 hours per week, but employees engaged in hazardous or harmful work to health work fewer hours than the above regulations. Employees are not allowed to work more than 36 hours of overtime per week. Employees who work overtime can receive at least 150% of their normal salary as overtime pay.',
    bonus: 'In addition to regular pay, companies are not obligated to provide bonuses, but there are typically 13th-month bonuses and performance-based bonuses.',
    contract: 'In Thailand, employment contracts can be presented orally or in writing. However, in most cases, labor contracts are also signed in writing and all employment terms and conditions are agreed upon. Employment contracts can be fixed-term contracts or indefinite-term contracts.',
    holidayWithSalary: 'Employees are entitled to six paid vacation days per year. If an employee does not use their annual leave within a year, it will be transferred to the next year and added to their annual leave, but this depends on the employer\'s willingness.',
    sickLeave: 'Generally, employees are entitled to up to 30 days of paid sick leave per year. After being absent from work due to illness for three days, employees must provide a medical certificate.',
    maternityLeaveAndPaternityLeave: 'Female employees are entitled to up to 98 days of full paid maternity leave (including weekends), with the company paying the employee\'s salary during the first 45 days of maternity leave, and the remaining period of maternity leave salary being covered by the social security fund. There is no paternity leave. Maternity leave is an additional employee benefit outside of sick leave.',
    individualIncomeTax: 'Personal income tax (1) adopts the declaration and payment system for personal income tax. Residents are those who have lived in Thailand for more than 180 days, and non-residents have lived for less than 180 days. When foreign-sourced income of residents is remitted to Thailand, it is taxed, while non-residents are exempt. Wages are taxed using the withholding tax system. There is no deduction for personal business in Thailand. Personal income tax is levied using a five-tier progressive tax rate of 0%-37%.',
    employerCosts: 'Employer costs are generally estimated at 5% of employee wages.',
    stopContract: 'When a fixed-term employment contract expires, the employer may choose not to renew it, but must notify the employee in advance. If the employer renews the contract, it must comply with the legal requirements for employment contracts.',
    holiday: 'Public holidays in Thailand include New Year\'s Day, Makha Bucha Day, Chakri Day, Songkran Festival, Labor Day, King\'s Coronation Day, Vesak Day, Asalha Puja Day, Queen\'s Birthday, King Rama V Memorial Day, King\'s Birthday, Constitution Day, and New Year\'s Eve.',
    insurance: 'Thailand has a universal healthcare system, where government officials can enjoy benefits provided by the national welfare system, and private company employees (foreign nationals and nationals) can enjoy benefits provided by the social security system. All other Thai citizens can enjoy benefits provided by the universal healthcare program. Usually, companies can also choose to provide supplementary private healthcare benefits for their employees.'
  },
  {
    // 日本
    entry: 'On TeleHire, after companies sign the employee\'s job scope agreement and pay the deposit, the employee can start work within two working days.',
    salary: 'Among various cities in Japan, the minimum hourly wage in Tokyo, Kanagawa, and Osaka is over 1000 yen, with Tokyo\'s minimum hourly wage being 1072 yen.',
    workTime: 'The standard workweek in Japan is five days (40 hours). Unless they hold managerial positions, companies should pay overtime to their employees. The overtime limit is a maximum of five hours per day, 45 hours per month, and 360 hours per year. Overtime pay is 125% to 175% of the employee\'s basic salary.',
    bonus: 'In addition to regular salary payments, companies are not obliged to pay bonuses, but in most cases, there are 13th-month bonuses and performance bonuses.',
    contract: 'Companies with ten or more employees must prepare a contract, including salary details, working hours, break time, rest days and vacations, shift schedules, and other employment-related terms and conditions. The employment contract must be written in Japanese. An employment contract is necessary for part-time work and must include eligibility for raises and bonuses as well as retirement benefits. Most employment contracts in Japan do not have a fixed term, and the probationary period is three to six months.',
    holidayWithSalary: 'In addition to public holidays, employees who have been employed for six months can enjoy ten days of paid annual leave if they work 80% of the total working days. An additional day is added every year and a half, followed by two days every year, up to a maximum of 20 days per year. Unused annual leave is valid for two years.',
    sickLeave: 'Companies are not required to provide sick leave to employees. However, many labor contracts in Japan do provide sick leave, and employees can use paid leave to make up for the days missed due to illness.',
    maternityLeaveAndPaternityLeave: 'Female employees can take 14 weeks of maternity leave. Companies are not required to pay employees during this period, but they may choose to do so. According to Japan\'s social security program, employees may also be eligible for maternity leave allowances. Any amount paid by the company is usually deducted from the social security fund. Employees can take up to one and a half years of paid childcare leave. New mothers can take up to one year of childcare leave from the end of their maternity leave, while fathers and other caregivers can take up to six months of childcare leave.',
    individualIncomeTax: 'Individual income tax rates range from 10% to 45%. ',
    employerCosts: 'Employer costs are generally estimated to be 17% of employee salaries.',
    stopContract: 'In Japan, labor contracts can be terminated by either the company or the employee upon completion of the contract period (if there is a fixed term). Companies must provide a 30-day advance notice or pay in lieu of such notice before terminating an employee, and must provide a valid reason for the termination. Valid reasons for termination include lack of ability to perform regular job duties, lack of qualification for the assigned work, violation of the company\'s employment rules, financial difficulty of the company, mutual agreement between the union and the company to terminate an employee, among others. The 30-day notice period does not apply to certain temporary workers, such as seasonal employees whose employment does not exceed four months. It is not legally required to pay a severance payment upon termination.',
    holiday: 'New Year\'s Day, Coming-of-Age Day, National Foundation Day, Emperor\'s Birthday, Vernal Equinox Day, Showa Day, Constitution Memorial Day, Greenery Day, Children\'s Day, Marine Day, Mountain Day, Respect for the Aged Day, Autumnal Equinox Day, Health and Sports Day, Culture Day, Labor Thanksgiving Day.',
    insurance: 'The country provides universal healthcare, but employees may need to pay for certain medical and surgical expenses. Japan\'s statutory health insurance payment plan covers 98.3% of the population, while the public social assistance program covers the remaining 1.7%. Citizens and non-citizen residents must participate in the above plan. Employment-based plans cover approximately 59% of the population. Social health insurance applies to each employee, and the employee and employer pay 5% of the employee\'s salary.'
  },
  {
    // 阿拉伯联合酋长国
    entry: 'On TeleHire, after a company signs an employee\'s job scope agreement and pays the deposit, the employee can start working within two working days.',
    salary: 'Local Emiratis tend to have relatively relaxed jobs, and the minimum wage standard for locals is 10,000 dirhams. In Dubai, those who earn less than 20,000 dirhams per month can also receive additional subsidies.',
    workTime: 'The standard working hours are 48 hours per week (Sunday to Thursday), with 8 hours of work per day. During the month of Ramadan, employees are only required to work 6 hours per day. Employees are entitled to at least one hour of rest break per day (they are not allowed to work continuously for 5 hours without a break), and they are entitled to 24 hours of rest time on Fridays each week.',
    bonus: 'Apart from the regular salary payments, companies are not obliged to pay bonuses, but usually, there are 13th-month bonuses and performance bonuses.',
    contract: 'Labor contracts in the UAE should be written in Arabic and include the following provisions: the names and addresses of the company and employee, the employee\'s nationality/ethnicity, the start date, the contract term and renewal provisions (for fixed-term contracts), and a probationary period not exceeding 180 days and not renewable.',
    holidayWithSalary: 'Regarding annual leave, employees who have worked for less than one year but more than six months are entitled to two days of paid annual leave per month, while those who have worked for one year or more are entitled to 30 days of paid annual leave per year.',
    sickLeave: 'After the probationary period, employees have the right to 45 days of paid sick leave. During the first 15 days of sick leave, employees are entitled to full pay, while during the subsequent 30 days, they are entitled to half pay. If all paid sick leave has been exhausted, employees may still take unpaid sick leave, but if the duration exceeds 45 days, the company may terminate the labor contract.',
    maternityLeaveAndPaternityLeave: 'Female employees are entitled to 45 days of fully paid maternity leave after completing one year of service. Female employees with less than one year of service can only enjoy half pay during maternity leave.',
    individualIncomeTax: '',
    employerCosts: 'The employer\'s cost is generally estimated to be 12.5% of the employee\'s salary.',
    stopContract: 'Either party can terminate the employment contract. Usually, the termination must be notified in writing. The notice period for termination of the contract is between 7 to 30 days, depending on the type of contract and the employee\'s length of service. Only in special cases is it not necessary to notify the other party in writing before terminating the contract, such as a violation of the terms of the contract or misconduct. Employees are entitled to severance pay after completing one year of service. Severance pay is usually calculated on the basis of 21 to 30 days\' salary per year of service.',
    holiday: 'Public holidays in the UAE include New Year\'s Day, Eid al-Fitr, Arafat Day and Eid al-Adha, Islamic New Year, Prophet Muhammad\'s birthday, and National Day.',
    insurance: 'Social security in the UAE only applies to local employees. Employers in regions other than Abu Dhabi contribute 12.5% (Abu Dhabi is 15%) and employees contribute 5%.'
  },
  {
    // 中国
    entry: 'On TeleHire, after a company signs an employee\'s job scope agreement and pays the deposit, the employee can start working within two working days.',
    salary: 'In China, the minimum wage varies from province to province, with average salaries ranging from 6,000 yuan to 13,000 yuan.',
    workTime: 'In China, employees work for 8 hours a day and 40 hours a week as normal working hours.',
    bonus: 'In addition to normal salary payments, companies are not obligated to pay bonuses, but usually offer 13th-month bonuses and performance bonuses.',
    contract: 'In China, both the employer and the employee must sign a written labor contract.',
    holidayWithSalary: 'Employees are entitled to 5 days of paid leave per year.',
    sickLeave: 'Regulations on sick leave: If the employee’s medical treatment period is three months, it will be calculated according to the accumulated sick leave time within six months; if it is six months, it will be calculated according to the accumulated sick leave time within twelve months; calculation etc. However, when employees ask for sick leave, they must present a disease diagnosis certificate issued by a physician from a regular medical institution.',
    maternityLeaveAndPaternityLeave: 'The number of days of maternity leave varies in each province and city in China, and the national statutory maternity leave is 98 days.',
    individualIncomeTax: 'Employee salary income is subject to personal income tax. The personal income tax threshold is 5,000 yuan, according to the step-by-step tax rate, from 3%, 10%, 20%, 25%, 30%, 35%, 45%',
    employerCosts: 'Employer costs are generally estimated at 20% of employee wages.',
    stopContract: 'When a fixed-term labor contract expires, the employer or employee may terminate the labor contract. If an employee is dismissed due to improper behavior, the employer is not required to provide advance notice or pay severance pay. Otherwise, the employer must notify the employee in advance of the termination of the contract and pay severance pay. The economic compensation is paid to the employee according to the standard of one month\'s salary for every year of work in the unit;For those who have worked for more than six months but less than one year, it is calculated as one year;For those who have worked for less than six months, the economic compensation paid to the worker is half a month\'s salary.Monthly salary refers to the average salary of the employee in the 12 months before the labor contract is terminated or expires.',
    holiday: 'New Year\'s Day, Spring Festival, Qingming Festival, Labor Day, Dragon Boat Festival, Mid-Autumn Festival, and National Day are all national holidays in China.',
    insurance: 'Companies are required to contribute a certain percentage of medical insurance for their employees.'
  },
  {
    // 韩国
    entry: 'On TeleHire, after a company signs an employee\'s job scope agreement and pays the deposit, the employee can start working within two working days.',
    salary: 'The basic salary ranges from 1.5 to 2.5 million South Korean won. ',
    workTime: 'The standard workweek is 40 hours, with 8 hours of work per day. Employees can work a maximum of 12 overtime hours per week with the consent of both parties, and some industries\' employees can work more than 12 hours of overtime per week with approval from the \"Ministry of Employment and Labor.\" If an employee works during holidays, overtime, or at night, the amount of salary received will be higher than the standard salary. Nighttime work is defined as work between 10 p.m. and 6 a.m. Employees are entitled to 30 minutes of unpaid rest time after working for 4 hours and 1 hour of unpaid rest time after working for 8 hours. Companies can also offer vacation time instead of overtime pay.',
    bonus: 'In addition to regular salary payments, companies are not obligated to pay bonuses, but typically there are 13th-month bonuses and performance bonuses.',
    contract: 'Public holidays include New Year\'s Day, Korean Lunar New Year\'s Day, Samil Day, Children\'s Day, Buddha\'s Birthday, Memorial Day, Liberation Day, Chuseok (Korean Thanksgiving), National Foundation Day, Hangul Day, and Christmas Day. After one year of service, employees are entitled to 15 days of paid annual leave, which increases by one day for every two years of service, up to a maximum of 25 days. In the first year of employment, employees are entitled to one day of paid annual leave per month, but this number will be deducted from the number of annual leave days available for the next year.',
    holidayWithSalary: ' After one year of service, employees are entitled to 15 days of paid annual leave, which increases by one day for every two years of service, up to a maximum of 25 days. In the first year of employment, employees are entitled to one day of paid annual leave per month, but this number will be deducted from the number of annual leave days available for the next year.',
    sickLeave: 'If an employee requires sick leave due to non-work-related illness or injury, the company is not required to provide sick leave but may choose to do so. However, if an employee requires sick leave due to work-related illness or injury, the company must provide paid sick leave. Female employees are entitled to 90 days of maternity leave, which increases to 120 days if they give birth to twins or multiple babies. After childbirth, female employees must take at least 45 consecutive days of maternity leave, which increases to 60 days for twins or multiple babies. During maternity leave, female employees receive 100% of their salary, which is paid by the company or the employment insurance fund, depending on the company\'s size. Typically, companies are responsible for paying female employees\' salaries during the first 60 days of maternity leave. Pregnant female employees are also entitled to prenatal leave. Male employees are entitled to parental leave for their child\'s birth.',
    maternityLeaveAndPaternityLeave: 'Female employees are entitled to 90 days of maternity leave, and if they give birth to twins or multiples, they can enjoy 120 days of maternity leave. After delivery, female employees must take at least 45 consecutive days of maternity leave, and if they give birth to twins or multiples, they must take at least 60 consecutive days of maternity leave. During the maternity leave period, female employees are entitled to 100% of their salary. The payment of maternity leave salary is covered by the company or employment insurance fund, depending on the company\'s size. Usually, the company will be responsible for paying the female employee\'s maternity leave salary for the first 60 days. During pregnancy, female employees are also entitled to prenatal leave.Male employees are entitled to 10 days of paid paternity leave due to the birth of a child. Male employees must take paternity leave within 90 days after the child\'s birth.',
    individualIncomeTax: 'If you reside in South Korea or have resided there for a year or more, you are generally considered a tax resident. Non-tax residents are only taxed on income from South Korea.',
    employerCosts: 'The individual income tax rate ranges from 6% to 38% (excluding local income surtax) depending on the different income ranges. Foreigners can choose a flat tax rate of 19% (excluding local income surtax), but the 19% flat tax rate only applies after the fifth year of working in South Korea.',
    stopContract: 'When a fixed-term labor contract expires, the contract may be terminated by the company or employee unilaterally or through mutual agreement. The company can only terminate an employee for legitimate reasons related to the employee or for emergency management needs (including layoffs). Before terminating an employee, the company must notify the employee 30 days in advance or provide compensation in lieu of notice. When the company terminates an employee, it must provide a written document stating the reason and date of termination. The written termination document may be given to the employee at the time of notification, but the specific date of delivery must not be later than the date of termination.',
    holiday: 'Public holidays include New Year\'s Day, Korean Lunar New Year\'s Day, Samil Day, Children\'s Day, Buddha\'s Birthday, Memorial Day, Liberation Day, Chuseok (Korean Thanksgiving), National Foundation Day, Hangul Day, and Christmas Day',
    insurance: 'South Korea implements a universal healthcare system, including the National Health Insurance program. The funding sources for the insurance program include mandatory health insurance premiums paid by companies and employees, government subsidies, and tobacco taxes. A certain proportion of the employee\'s salary is paid as health insurance premiums, which are shared by the company and the employee. The company deducts the health insurance premiums from the employee\'s salary each month.'
  },
]

const NationalPolicyPage = () => {
  const [showRequestDemoDialog, setShowRequestDemoDialog] = useState(false)
  const [country, setCountry] = useState<string>('')
  const router = useRouter()
  const { t } = useTranslation()
  useEffect(() => {
    if(router.query.country) {
      setCountry(String(router.query.country))
    }
  }, [router])

  const handleCloseRequestDemoDialog = (show: boolean | ((prevState: boolean) => boolean)) => {
    setShowRequestDemoDialog(show)
  }

  const handleRequestDemo = () => {
    setShowRequestDemoDialog(true)
  }
  console.log('v1.0')
  return (
    <Box
      sx={theme => ({
        '.layout-page-content': { [theme.breakpoints.up('sm')]: { padding: '0' } },
        '& img': { display: 'block', maxWidth: '100%' }
      })}
    >
      <Tips />
      <Nav onRequestDemo={handleRequestDemo} />
      <NationalPolicy onRequestDemo={handleRequestDemo} currentCountry={defaultValue[country ?Number(country) : 0]} currentCountryContent={countryContentList[country ?Number(country) : 0]} />
      <Footer onRequestDemo={handleRequestDemo} />
      <DialogRequestDemo show={showRequestDemoDialog} onClose={handleCloseRequestDemoDialog} />
    </Box>
  )
}

NationalPolicyPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

NationalPolicyPage.authGuard = false
NationalPolicyPage.guestGuard = false

export default NationalPolicyPage

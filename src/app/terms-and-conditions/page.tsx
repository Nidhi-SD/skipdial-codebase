import type { Metadata } from "next";
import { PageHero, Section } from "@/components/blocks";
import { LegalDoc, type LegalBlock } from "@/components/blocks/LegalDoc";

export const metadata: Metadata = {
  title: "Terms and Conditions | SkipDial",
  description:
    "The terms that govern use of SkipDial's AI voice agent services, including customer responsibilities, compliance obligations, fees, and liability.",
};

/* Terms text carried over verbatim from SkipDial_Terms_and_Conditions_v2.
   Section headings are title-cased for presentation only — per the Miscellaneous
   section, headings are for convenience and do not affect interpretation. */

const terms: LegalBlock[] = [
  { type: "h2", text: "Acceptance of Terms" },
  {
    type: "p",
    text: "These Terms and Conditions (“Terms”) govern the use of SkipDial services provided by SkipDial AI, LLC (“SkipDial”, “Company”, “we”, “us”, or “our”). By executing an Order Form, using the Services, or accessing the SkipDial platform, the customer (“Customer” or “you”) agrees to be bound by these Terms. These Terms may be updated from time to time and the version posted on the Company’s website at the time an Order Form is executed will apply.",
  },
  { type: "h2", text: "Services" },
  {
    type: "p",
    text: "SkipDial provides AI-powered voice agents and related automation services designed to assist businesses with inbound and outbound call handling, customer service inquiries, lead qualification, appointment scheduling, messaging, and related communication workflows (collectively, the “Services”). The Services may include, but are not limited to, automated call answering, information delivery, call routing, basic customer support interactions, lead capture, appointment booking, outbound call campaigns, and integration with third-party systems such as CRM platforms, scheduling systems, and messaging services.",
  },
  {
    type: "p",
    text: "Detailed scripts, prompts, call flows, routing rules, messaging content, contact cadence, integrations, and SOP configuration will be finalized during onboarding based on Customer-approved requirements. Services are limited to the scope and selections stated in the applicable Order Form. Material additions or changes to the selected channels, integrations, workflows, or business processes may require additional fees, a change order, or a new Order Form.",
  },
  { type: "h2", text: "Order Forms" },
  {
    type: "p",
    text: "SkipDial may issue an Order Form describing the selected Services and applicable commercial terms. Unless an Order Form expressly requires SkipDial’s countersignature, the Order Form becomes binding and effective on the date Customer signs or electronically accepts it (“Effective Date”), and no separate signature by SkipDial is required.",
  },
  {
    type: "p",
    text: "The Order Form will define the selected Services, scope, pricing, duration, minimum commitments, usage limits, and any special conditions. If there is a conflict between these Terms and an Order Form, the Order Form will control.",
  },
  { type: "h2", text: "Customer Responsibilities" },
  {
    type: "p",
    text: "Customer is responsible for providing accurate and complete information necessary for the operation of the Services, including but not limited to phone numbers, scripts, routing rules, call flows, and business information. Customer is solely responsible for the accuracy, legality, and appropriateness of all data, instructions, and materials provided to SkipDial for use in connection with the Services.",
  },
  {
    type: "p",
    text: "Customer represents and warrants that it has the legal right to use and contact all phone numbers or contact information provided to SkipDial and that such contact information has been obtained and maintained in compliance with all applicable laws and regulations.",
  },
  {
    type: "p",
    text: "Without limiting the foregoing, Customer is responsible for ensuring that all calling lists, contact databases, and phone numbers have been properly scrubbed against all applicable Do Not Call registries and suppression lists, including but not limited to the National Do Not Call Registry, applicable state Do Not Call registries, and the Customer’s internal Do Not Call list. Customer further agrees that it will not provide SkipDial with phone numbers that are registered on any Do Not Call list or that otherwise may not legally be contacted.",
  },
  {
    type: "p",
    text: "Customer is solely responsible for compliance with all applicable laws and regulations governing communications conducted through the Services, including but not limited to telemarketing, robocalling, consent requirements, privacy, and consumer protection laws, including the Telephone Consumer Protection Act (TCPA), the Telemarketing Sales Rule (TSR), and any applicable state laws or regulations.",
  },
  {
    type: "p",
    text: "SkipDial acts solely as a technology platform and does not review, validate, or verify the legality or compliance of Customer-provided data, calling lists, scripts, or communications. Customer assumes full responsibility and liability for all communications initiated, transmitted, or conducted through the Services.",
  },
  { type: "h2", text: "AI Disclosure" },
  {
    type: "p",
    text: "Customer acknowledges that the Services may utilize artificial intelligence, automated systems, and voice or text generation technologies to assist in handling communications, responding to inquiries, routing calls, and performing workflow automation. Customer is responsible for determining whether any disclosure, notification, or consent is required when communicating with callers, customers, or prospects who may interact with automated or AI-enabled systems.",
  },
  {
    type: "p",
    text: "Customer agrees to implement any legally required disclosures informing call participants that they may be interacting with an automated system, AI-enabled assistant, or recorded system, where such disclosure is required by applicable law. SkipDial does not determine when such disclosures are legally required and is not responsible for Customer’s failure to provide appropriate notice. AI-generated responses, summaries, and outputs may contain inaccuracies or incomplete information.",
  },
  { type: "h2", text: "Acceptable Use" },
  {
    type: "p",
    text: "Customer agrees to use the Services only for lawful purposes and in compliance with all applicable laws and regulations. Customer shall not use the Services in any manner that violates telemarketing laws, privacy laws, consumer protection laws, or any other applicable federal, state, or local regulations.",
  },
  {
    type: "p",
    text: "Without limitation, Customer agrees not to use the Services to:",
  },
  {
    type: "ul",
    items: [
      "initiate unlawful robocalls or telemarketing communications",
      "contact individuals on Do Not Call registries or other suppression lists",
      "transmit fraudulent, deceptive, misleading, or abusive communications",
      "impersonate individuals or entities without authorization",
      "conduct harassment, scams, or other unlawful activities",
      "violate the rights of any third party, including privacy or publicity rights",
    ],
  },
  {
    type: "p",
    text: "SkipDial reserves the right to suspend, restrict, or terminate access to the Services immediately if SkipDial reasonably believes that Customer’s use of the Services: (a) violates applicable laws or regulations; (b) violates these Terms; (c) creates risk of regulatory enforcement, legal liability, or reputational harm to SkipDial; (d) triggers complaints from telecommunications carriers, regulators, or third parties; or (e) involves suspected fraud, abuse, or unlawful communications activity. SkipDial may take such action without prior notice when reasonably necessary to protect the integrity of the platform or comply with legal or regulatory obligations.",
  },
  { type: "h2", text: "Regulatory Changes" },
  {
    type: "p",
    text: "Customer acknowledges that laws and regulations governing automated communications, telemarketing, artificial intelligence, privacy, and consumer protection may change over time. If changes in applicable laws or regulatory guidance require modifications to the Services, operational practices, or Customer’s use of the Services, SkipDial reserves the right to update, modify, suspend, or limit certain features or functionality in order to comply with such legal or regulatory requirements.",
  },
  {
    type: "p",
    text: "SkipDial shall not be liable for any interruption, modification, or limitation of the Services resulting from efforts to comply with applicable laws or regulatory changes. Customer agrees to cooperate with any reasonable changes to system configuration, scripts, disclosures, or operational practices necessary to maintain compliance with applicable law.",
  },
  { type: "h2", text: "Call Recording and Compliance" },
  {
    type: "p",
    text: "SkipDial technology may record, transcribe, summarize, monitor, or otherwise process calls depending on the configuration selected or requested by Customer. Available configurations may include full call recording, partial recording, transcription and summary without audio recording, real-time monitoring, or audible disclosure messages informing call participants that the call may be monitored or recorded for quality assurance or training purposes.",
  },
  {
    type: "p",
    text: "Customer is responsible for determining the appropriate configuration for its use case and for instructing SkipDial accordingly. Customer acknowledges that SkipDial does not determine whether call recording, transcription, monitoring, or disclosure is legally required in any jurisdiction.",
  },
  {
    type: "p",
    text: "Customer is solely responsible for ensuring that all communications conducted through the Services comply with applicable federal, state, and local laws governing call recording, monitoring, consent, and disclosure requirements. This includes, but is not limited to, compliance with one-party consent or two-party (all-party) consent laws and any requirements to provide notice that a call may be monitored or recorded.",
  },
  {
    type: "p",
    text: "Customer agrees that it will implement and maintain all legally required notices, disclosures, and consent mechanisms before recording, monitoring, or processing any call through the Services. Customer further agrees to indemnify and hold SkipDial harmless from any claims, damages, penalties, or liabilities arising from Customer’s failure to comply with applicable call recording, monitoring, or consent laws.",
  },
  { type: "h2", text: "Fees and Payment" },
  {
    type: "p",
    text: "Customer agrees to pay all fees specified in the applicable Order Form. Fees may include subscription fees, usage-based charges, implementation fees, and any other charges agreed to by the parties.",
  },
  {
    type: "p",
    text: "Customer must maintain a valid payment method on file. By providing payment information and signing an Order Form, Customer represents that it is authorized to use the payment method and authorizes SkipDial and its third-party payment processor to store and automatically charge it, without further approval or invoice, for all amounts due under the applicable Order Form. Unless otherwise stated in the Order Form, setup and implementation fees and the first subscription payment will be charged on the Effective Date, recurring subscription fees will be charged monthly in advance, and usage or overage charges will be charged following the applicable billing period. Customer authorizes SkipDial to retry declined charges and agrees to promptly update any expired or invalid payment information.",
  },
  {
    type: "p",
    text: "All payments made to SkipDial are final and non-refundable. Customer agrees that no refunds, credits, or prorated adjustments will be provided for any reason, including but not limited to partial billing periods, unused Services, early termination, account suspension due to non-payment, or Customer’s decision to discontinue use of the Services.",
  },
  {
    type: "p",
    text: "SkipDial reserves the right to suspend or terminate Services for non-payment or late payment, and such suspension does not relieve Customer of any obligation to pay outstanding amounts due under the Order Form.",
  },
  { type: "h2", text: "No Guarantee of Results" },
  {
    type: "p",
    text: "The Services are provided to assist in communication handling, call management, and workflow automation. While SkipDial technology can be configured and customized to support Customer’s operational preferences, scripts, routing rules, and communication workflows, SkipDial does not control and cannot predict the behavior, responses, or decisions of Customer’s callers, customers, prospects, or other third parties.",
  },
  {
    type: "p",
    text: "Customer acknowledges that outcomes from the use of the Services may vary based on numerous factors outside of SkipDial’s control, including but not limited to the quality of Customer-provided scripts, calling lists, business processes, products or services offered, and the behavior and responsiveness of third parties interacting with the system.",
  },
  {
    type: "p",
    text: "Accordingly, SkipDial makes no representations or warranties regarding any specific business results, performance metrics, revenue, lead generation, conversion rates, call outcomes, or operational results arising from the use of the Services. No performance guarantees of any kind are provided or implied.",
  },
  { type: "h2", text: "Intellectual Property" },
  {
    type: "p",
    text: "SkipDial retains all right, title, and interest in and to the SkipDial platform, including all underlying technology, software, algorithms, models, systems, workflows, methodologies, user interfaces, and other platform components used to provide the Services, together with any improvements, enhancements, or modifications thereto. Nothing in this Agreement grants Customer any ownership rights in the SkipDial platform or technology.",
  },
  {
    type: "p",
    text: "Customer retains ownership of all content, scripts, data, contact lists, routing rules, business information, and other materials provided by Customer for use in connection with the Services (“Customer Materials”). Customer grants SkipDial a non-exclusive, worldwide, royalty-free license to use, process, store, transmit, analyze, and otherwise utilize Customer Materials solely as necessary to provide, operate, support, and improve the Services.",
  },
  {
    type: "p",
    text: "Customer acknowledges that the operation of the Services may generate operational data, call metadata, transcripts, summaries, analytics, system logs, usage data, performance metrics, and other information derived from the use of the platform (“Service Data”). Except for Customer Materials contained within such data, SkipDial retains the right to use, analyze, aggregate, and incorporate Service Data for purposes including but not limited to improving the platform, training and refining system performance, developing new features, benchmarking performance, conducting analytics, and supporting other customers, provided that any such use does not publicly disclose Customer’s confidential business information in identifiable form.",
  },
  {
    type: "p",
    text: "To the extent that any insights, performance data, learnings, workflows, or operational improvements are generated through the use of the Services, such information may be used by SkipDial in its business operations, product development, and service delivery. The parties acknowledge that operational insights and Service Data generated through the use of the platform may benefit both parties, and nothing in this Agreement restricts SkipDial from using aggregated or anonymized data derived from the Services.",
  },
  { type: "h2", text: "Confidentiality" },
  {
    type: "p",
    text: "Each party agrees to keep confidential any non-public business, technical, financial, operational, or strategic information disclosed by the other party (“Confidential Information”). Confidential Information includes, but is not limited to, business plans, pricing, customer information, technology, product designs, software, data, marketing strategies, and any other information that a reasonable person would understand to be confidential given the nature of the information and the circumstances of disclosure.",
  },
  {
    type: "p",
    text: "Each party agrees to use the other party’s Confidential Information solely for the purpose of performing its obligations or exercising its rights under this Agreement and not for any other purpose. Each party further agrees to take reasonable measures to protect the confidentiality of such information and to prevent unauthorized disclosure, using at least the same degree of care it uses to protect its own confidential information of similar nature.",
  },
  {
    type: "p",
    text: "Confidential Information does not include information that: (a) becomes publicly available through no fault of the receiving party; (b) was lawfully known to the receiving party prior to disclosure; (c) is independently developed without use of or reference to the disclosing party’s Confidential Information; or (d) is lawfully obtained from a third party without restriction.",
  },
  {
    type: "p",
    text: "Each party may disclose Confidential Information to its employees, contractors, advisors, or service providers who have a legitimate need to know such information in connection with the performance of this Agreement, provided that such individuals are bound by confidentiality obligations no less restrictive than those set forth herein.",
  },
  {
    type: "p",
    text: "These confidentiality obligations shall survive the termination or expiration of this Agreement.",
  },
  { type: "h2", text: "Indemnification" },
  {
    type: "p",
    text: "CUSTOMER AGREES TO DEFEND, INDEMNIFY, AND HOLD HARMLESS SKIPDIAL, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AND SERVICE PROVIDERS FROM AND AGAINST ANY AND ALL CLAIMS, DEMANDS, ACTIONS, DAMAGES, LIABILITIES, FINES, PENALTIES, LOSSES, AND EXPENSES (INCLUDING REASONABLE ATTORNEYS’ FEES) ARISING OUT OF OR RELATED TO:",
  },
  {
    type: "ul",
    items: [
      "CUSTOMER’S USE OF THE SERVICES",
      "CUSTOMER-PROVIDED DATA, CALL LISTS, SCRIPTS, ROUTING RULES, OR OTHER MATERIALS",
      "CUSTOMER’S FAILURE TO COMPLY WITH APPLICABLE LAWS OR REGULATIONS, INCLUDING BUT NOT LIMITED TO THE TELEPHONE CONSUMER PROTECTION ACT (TCPA), TELEMARKETING SALES RULE (TSR), DO NOT CALL REGULATIONS, CALL RECORDING LAWS, PRIVACY LAWS, OR CONSUMER PROTECTION LAWS",
      "CUSTOMER’S FAILURE TO PROPERLY SCRUB CALLING LISTS AGAINST APPLICABLE DO NOT CALL REGISTRIES OR SUPPRESSION LISTS",
      "ANY COMMUNICATION INITIATED, TRANSMITTED, OR CONDUCTED USING THE SERVICES AT CUSTOMER’S DIRECTION",
      "ANY CLAIM THAT CUSTOMER’S CONTENT, DATA, SCRIPTS, OR COMMUNICATIONS VIOLATE THE RIGHTS OF A THIRD PARTY",
    ],
  },
  {
    type: "p",
    text: "CUSTOMER AGREES THAT SKIPDIAL MAY PARTICIPATE IN THE DEFENSE OF ANY SUCH CLAIM WITH COUNSEL OF ITS CHOOSING AT CUSTOMER’S EXPENSE. CUSTOMER MAY NOT SETTLE ANY CLAIM THAT IMPOSES LIABILITY OR OBLIGATIONS ON SKIPDIAL WITHOUT SKIPDIAL’S PRIOR WRITTEN CONSENT.",
  },
  {
    type: "p",
    text: "THIS INDEMNIFICATION OBLIGATION SHALL SURVIVE TERMINATION OF THESE TERMS AND SHALL NOT BE LIMITED BY THE LIMITATION OF LIABILITY PROVISIONS CONTAINED IN THESE TERMS.",
  },
  { type: "h2", text: "Limitation of Liability" },
  {
    type: "p",
    text: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SKIPDIAL AND ITS OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS, AFFILIATES, AND SERVICE PROVIDERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF BUSINESS OPPORTUNITIES, LOSS OF DATA, LOSS OF GOODWILL, BUSINESS INTERRUPTION, OR THE COST OF SUBSTITUTE SERVICES, ARISING OUT OF OR RELATED TO THE USE OF OR INABILITY TO USE THE SERVICES, EVEN IF SKIPDIAL HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
  },
  {
    type: "p",
    text: "SKIPDIAL SHALL NOT BE RESPONSIBLE OR LIABLE FOR ANY DAMAGES, CLAIMS, PENALTIES, OR LOSSES ARISING FROM CUSTOMER’S USE OF THE SERVICES IN VIOLATION OF APPLICABLE LAWS OR REGULATIONS, INCLUDING BUT NOT LIMITED TO TELEMARKETING LAWS, CALL RECORDING LAWS, PRIVACY LAWS, OR CONSUMER PROTECTION REGULATIONS. SKIPDIAL SHALL ALSO NOT BE RESPONSIBLE FOR THE ACCURACY, LEGALITY, OR QUALITY OF ANY DATA, SCRIPTS, CALL LISTS, ROUTING INSTRUCTIONS, OR OTHER MATERIALS PROVIDED BY CUSTOMER.",
  },
  {
    type: "p",
    text: "SKIPDIAL SHALL NOT BE LIABLE FOR FAILURES, INTERRUPTIONS, DELAYS, OR PERFORMANCE ISSUES CAUSED BY FACTORS OUTSIDE OF ITS REASONABLE CONTROL, INCLUDING BUT NOT LIMITED TO TELECOMMUNICATIONS PROVIDERS, THIRD-PARTY PLATFORMS, INTERNET SERVICE PROVIDERS, ARTIFICIAL INTELLIGENCE SERVICE PROVIDERS, POWER OUTAGES, OR OTHER INFRASTRUCTURE DEPENDENCIES.",
  },
  {
    type: "p",
    text: "IN ALL CASES, SKIPDIAL’S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THE SERVICES OR THIS AGREEMENT, WHETHER IN CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE, SHALL NOT EXCEED THE TOTAL AMOUNT OF FEES ACTUALLY PAID BY CUSTOMER TO SKIPDIAL DURING THE SIX (6) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM. THIS LIMITATION APPLIES REGARDLESS OF THE NUMBER OF CLAIMS OR EVENTS.",
  },
  { type: "h2", text: "Disclaimer of Warranties" },
  {
    type: "p",
    text: "THE SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SKIPDIAL DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, OR RELIABILITY.",
  },
  {
    type: "p",
    text: "SKIPDIAL DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE FROM DEFECTS, NOR DOES SKIPDIAL GUARANTEE THAT THE SERVICES WILL MEET CUSTOMER’S SPECIFIC BUSINESS REQUIREMENTS OR EXPECTATIONS. CUSTOMER ACKNOWLEDGES THAT AUTOMATED SYSTEMS, ARTIFICIAL INTELLIGENCE TECHNOLOGIES, TELECOMMUNICATIONS NETWORKS, AND THIRD-PARTY SERVICES MAY EXPERIENCE INTERRUPTIONS OR INACCURACIES THAT ARE OUTSIDE OF SKIPDIAL’S CONTROL.",
  },
  { type: "h2", text: "Third-Party Services" },
  {
    type: "p",
    text: "The Services may rely on or integrate with third-party services, platforms, or infrastructure providers, including but not limited to telecommunications carriers, cloud hosting providers, messaging platforms, customer relationship management systems, and artificial intelligence service providers.",
  },
  {
    type: "p",
    text: "Customer acknowledges that the availability, performance, and reliability of such third-party services are outside of SkipDial’s control. SkipDial shall not be responsible or liable for any interruptions, errors, delays, data loss, or other issues caused by third-party services, including outages, API failures, service limitations, or changes imposed by such providers.",
  },
  {
    type: "p",
    text: "Customer’s use of third-party services in connection with the Services may also be subject to the terms and conditions of those third parties. Telecommunications carriers and network providers may block, filter, label, delay, or otherwise restrict communications based on their internal policies, regulatory guidance, or spam detection systems. SkipDial does not guarantee call completion rates or the absence of carrier filtering or spam labeling.",
  },
  { type: "h2", text: "Reasonable Data Security and Data Processing" },
  {
    type: "p",
    text: "SkipDial will implement commercially reasonable administrative, technical, and organizational measures designed to protect Customer data and Service Data from unauthorized access, disclosure, alteration, or destruction.",
  },
  {
    type: "p",
    text: "Customer acknowledges that no system or transmission of data over the internet can be guaranteed to be completely secure. SkipDial does not guarantee absolute security of any data transmitted, processed, or stored through the Services.",
  },
  {
    type: "p",
    text: "Customer is responsible for ensuring that any data provided to SkipDial is lawfully obtained and that Customer has the necessary rights and permissions to process such data using the Services.",
  },
  {
    type: "p",
    text: "SkipDial may process, store, transmit, and analyze Customer data and Service Data as reasonably necessary to provide, maintain, improve, and support the Services, consistent with the rights described in these Terms.",
  },
  { type: "h2", text: "Service Availability and Maintenance" },
  {
    type: "p",
    text: "SkipDial will use commercially reasonable efforts to maintain the availability and operation of the Services, excluding scheduled maintenance, emergency maintenance, and interruptions caused by factors outside of SkipDial’s reasonable control.",
  },
  {
    type: "p",
    text: "SkipDial reserves the right to perform maintenance, upgrades, updates, and modifications to the Services in order to improve functionality, security, performance, or regulatory compliance. Such maintenance may result in temporary interruptions of the Services.",
  },
  {
    type: "p",
    text: "SkipDial shall not be liable for any interruption, delay, or modification of the Services resulting from scheduled maintenance, system updates, infrastructure changes, or improvements to the platform.",
  },
  { type: "h2", text: "Term and Termination" },
  {
    type: "p",
    text: "The term of the Services will be defined in the applicable Order Form. Customer may terminate the Services as provided in the Order Form. SkipDial may suspend or terminate the Services as permitted by these Terms or the applicable Order Form. Termination does not relieve Customer of any amounts due or obligations incurred before termination, including any fees owed for the remainder of an Initial Term.",
  },
  { type: "h2", text: "Governing Law and Venue" },
  {
    type: "p",
    text: "These Terms, and any dispute, claim, or controversy arising out of or relating to these Terms or the Services provided by SkipDial, shall be governed by and construed in accordance with the laws of the State of Arizona, without regard to its conflict of laws principles.",
  },
  {
    type: "p",
    text: "The parties agree that any legal action, suit, or proceeding arising out of or relating to these Terms or the Services shall be brought exclusively in the state or federal courts located in Maricopa County, Arizona. Each party hereby irrevocably submits to the personal jurisdiction of such courts and waives any objection based on improper venue or forum non conveniens.",
  },
  {
    type: "p",
    text: "Each party agrees that the courts located in Maricopa County, Arizona shall be the sole and exclusive venue for resolving any disputes arising under this Agreement, except where applicable law requires otherwise. The prevailing party in any legal action or proceeding arising out of or relating to these Terms shall be entitled to recover its reasonable attorneys’ fees and costs to the extent permitted by law.",
  },
  { type: "h2", text: "Miscellaneous" },
  {
    type: "p",
    text: "These Terms, together with any applicable Order Form, constitute the entire agreement between the parties regarding the Services and supersede all prior or contemporaneous agreements, discussions, proposals, or communications, whether written or oral, relating to the subject matter hereof.",
  },
  {
    type: "p",
    text: "Customer may not assign, transfer, delegate, or otherwise convey any of its rights or obligations under these Terms without the prior written consent of SkipDial, which shall not be unreasonably withheld. SkipDial may assign or transfer these Terms, in whole or in part, without Customer’s consent in connection with a merger, acquisition, corporate reorganization, sale of assets, or similar transaction, or to an affiliate.",
  },
  {
    type: "p",
    text: "No waiver of any provision of these Terms shall be deemed a waiver of any other provision, nor shall any waiver constitute a continuing waiver unless expressly stated in writing. The failure of either party to enforce any right or provision under these Terms shall not constitute a waiver of such right or provision.",
  },
  {
    type: "p",
    text: "If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions will remain in full force and effect and shall be interpreted so as to best accomplish the original intent of the parties.",
  },
  {
    type: "p",
    text: "Section headings in these Terms are provided for convenience only and shall not affect the interpretation of any provision.",
  },
  {
    type: "p",
    text: "Order Forms and any related agreements or approvals may be executed and delivered electronically, including through electronic signatures, digital acceptance, or other electronic means, and such electronic signatures or approvals shall be deemed legally binding and enforceable to the same extent as an original handwritten signature.",
  },
  { type: "h2", text: "Force Majeure" },
  {
    type: "p",
    text: "SkipDial shall not be liable for any failure or delay in the performance of its obligations under these Terms if such failure or delay results from events beyond its reasonable control. Such events may include, but are not limited to, acts of God, natural disasters, fire, flood, earthquake, war, terrorism, civil unrest, labor disputes, government actions, telecommunications failures, internet service disruptions, power outages, cyberattacks, failures of cloud infrastructure providers, failures of artificial intelligence service providers, or failures of third-party communication networks.",
  },
  {
    type: "p",
    text: "During any such event, SkipDial’s obligations under these Terms shall be suspended for the duration of the force majeure event. SkipDial will make commercially reasonable efforts to restore Services as soon as practicable once the event has ended.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and Conditions"
        body="The terms that govern your use of SkipDial's AI voice agents and related automation services."
      />
      <Section className="pt-4">
        <LegalDoc blocks={terms} />
      </Section>
    </>
  );
}

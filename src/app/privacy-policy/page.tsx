import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { PageHero, Section } from "@/components/blocks";

export const metadata: Metadata = {
  title: "Privacy Policy | SkipDial",
  description:
    "How SkipDial collects, uses, and protects your personal data when you use our website and services.",
};

/* Policy text carried over verbatim from the live site (skipdial.ai/privacy-policy). */

type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

const policy: Block[] = [
  {
    type: "p",
    text: "This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.",
  },
  {
    type: "p",
    text: "We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from https://www.skipdial.ai/.",
  },
  { type: "h2", text: "Information Collection And Use" },
  {
    type: "p",
    text: "We collect several different types of information for various purposes to provide and improve our Service to you.",
  },
  { type: "h3", text: "Personal Data" },
  {
    type: "p",
    text: "While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (“Personal Data”). Personally identifiable information may include, but is not limited to:",
  },
  {
    type: "ul",
    items: ["Email address", "First name and last name", "Cookies and Usage Data"],
  },
  { type: "h3", text: "Usage Data" },
  {
    type: "p",
    text: "We may also collect information how the Service is accessed and used (“Usage Data”). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.",
  },
  { type: "h3", text: "Tracking & Cookies Data" },
  {
    type: "p",
    text: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.",
  },
  {
    type: "p",
    text: "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.",
  },
  {
    type: "ul",
    items: [
      "Session Cookies. We use Session Cookies to operate our Service.",
      "Preference Cookies. We use Preference Cookies to remember your preferences and various settings.",
      "Security Cookies. We use Security Cookies for security purposes.",
    ],
  },
  { type: "h2", text: "Use of Data" },
  { type: "p", text: "REV77 uses the collected data for various purposes:" },
  {
    type: "ul",
    items: [
      "To provide and maintain the Service",
      "To notify you about changes to our Service",
      "To allow you to participate in interactive features of our Service when you choose to do so",
      "To provide customer care and support",
      "To provide analysis or valuable information so that we can improve the Service",
      "To monitor the usage of the Service",
      "To detect, prevent and address technical issues",
    ],
  },
  { type: "h2", text: "Transfer Of Data" },
  {
    type: "p",
    text: "Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.",
  },
  {
    type: "p",
    text: "If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.",
  },
  {
    type: "p",
    text: "REV77 will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.",
  },
  { type: "h2", text: "Disclosure Of Data" },
  { type: "h3", text: "Legal Requirements" },
  {
    type: "p",
    text: "REV77 may disclose your Personal Data in the good faith belief that such action is necessary to:",
  },
  {
    type: "ul",
    items: [
      "To comply with a legal obligation",
      "To protect and defend the rights or property of REV77",
      "To prevent or investigate possible wrongdoing in connection with the Service",
      "To protect the personal safety of users of the Service or the public",
      "To protect against legal liability",
    ],
  },
  { type: "h2", text: "Security Of Data" },
  {
    type: "p",
    text: "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.",
  },
  { type: "h2", text: "Service Providers" },
  {
    type: "p",
    text: "We may employ third party companies and individuals to facilitate our Service (“Service Providers”), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.",
  },
  {
    type: "p",
    text: "These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.",
  },
  { type: "h2", text: "Analytics" },
  {
    type: "p",
    text: "We may use third-party Service Providers to monitor and analyze the use of our Service.",
  },
  { type: "h3", text: "Google Analytics" },
  {
    type: "p",
    text: "Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.",
  },
  {
    type: "p",
    text: "You can opt-out of having made your activity on the Service available to Google Analytics by installing the Google Analytics opt-out browser add-on. The add-on prevents the Google Analytics JavaScript (ga.js, analytics.js, and dc.js) from sharing information with Google Analytics about visits activity. For more information on the privacy practices of Google, please visit the Google Privacy & Terms web page: https://policies.google.com/privacy?hl=en",
  },
  { type: "h2", text: "Links To Other Sites" },
  {
    type: "p",
    text: "Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.",
  },
  { type: "h2", text: "Children's Privacy" },
  {
    type: "p",
    text: "Our Service does not address anyone under the age of 18 (“Children”). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.",
  },
  { type: "h2", text: "Changes To This Privacy Policy" },
  {
    type: "p",
    text: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the “effective date” at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <Section className="pt-4">
        <Container>
          <div className="mx-auto max-w-3xl">
            {policy.map((block, i) => {
              switch (block.type) {
                case "h2":
                  return (
                    <h2
                      key={i}
                      className="mt-12 border-b border-line pb-3 text-display-sm font-bold first:mt-0"
                    >
                      {block.text}
                    </h2>
                  );
                case "h3":
                  return (
                    <h3 key={i} className="mt-8 text-[17px] font-bold">
                      {block.text}
                    </h3>
                  );
                case "ul":
                  return (
                    <ul
                      key={i}
                      className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-ink-light marker:text-accent"
                    >
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  );
                default:
                  return (
                    <p
                      key={i}
                      className="mt-4 text-[15px] leading-relaxed text-ink-light"
                    >
                      {block.text}
                    </p>
                  );
              }
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}

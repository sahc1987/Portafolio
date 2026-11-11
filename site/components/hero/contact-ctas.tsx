import { Download, Mail, MessageCircle } from 'lucide-react';
import type { Content } from '@/content/types';
import { EVENTS } from '@/lib/analytics';
import { mailtoHref, whatsappHref } from '@/lib/site';
import { LinkedinIcon } from '@/components/ui/brand-icons';
import { CtaButton } from '@/components/ui/cta-button';

/** Download CV, Email, LinkedIn, WhatsApp. Shared by the hero and the contact section. */
export function ContactCtas({ content }: { content: Content }) {
  const { profile, cv, ui } = content;
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <CtaButton
        href={cv.path}
        event={EVENTS.downloadCv}
        variant="primary"
        download
        ariaLabel={cv.label}
        icon={<Download size={18} aria-hidden="true" />}
      >
        {ui.cta.downloadCv}
      </CtaButton>
      <CtaButton
        href={mailtoHref(profile.email)}
        event={EVENTS.email}
        icon={<Mail size={18} aria-hidden="true" />}
      >
        {ui.cta.email}
      </CtaButton>
      <CtaButton
        href={profile.linkedinUrl}
        event={EVENTS.linkedin}
        external
        icon={<LinkedinIcon size={18} />}
      >
        {ui.cta.linkedin}
      </CtaButton>
      <CtaButton
        href={whatsappHref(profile.whatsappNumber)}
        event={EVENTS.whatsapp}
        external
        icon={<MessageCircle size={18} aria-hidden="true" />}
      >
        {ui.cta.whatsapp}
      </CtaButton>
    </div>
  );
}

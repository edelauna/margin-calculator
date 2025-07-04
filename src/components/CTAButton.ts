export default function CTAButton() {
  return {
    referralUrl: 'https://www.wealthsimple.com/invite/9GB9LQ',
    openReferralLink() {
      window.open(this.referralUrl, '_blank');
    },
  };
}
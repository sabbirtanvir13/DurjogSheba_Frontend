import BecomeVolunteerSection from "@/components/modules/HomePage/BecomeVolunteerSection";
import DonationCampaigns from "@/components/modules/HomePage/DonationCampaigns";
import EmergencyAlerts from "@/components/modules/HomePage/EmergencyAlerts";
import FAQ from "@/components/modules/HomePage/FAQ";
import { HeroSection } from "@/components/modules/HomePage/Hero";
import HowWeHelp from "@/components/modules/HomePage/HowWeHelp";
import ImpactStatistics from "@/components/modules/HomePage/ImpactStatistics";
import RecentReliefActivities from "@/components/modules/HomePage/RecentReliefActivities";
import ShelterSection from "@/components/modules/HomePage/ShelterSection";
import UrgentReliefNeeds from "@/components/modules/HomePage/UrgentReliefNeeds";

export default function Homepage() {
  return (
    <div>
      <HeroSection />
      <ImpactStatistics />
      <EmergencyAlerts />
      <UrgentReliefNeeds />
      <HowWeHelp />
      <ShelterSection />
      <DonationCampaigns />
      <BecomeVolunteerSection />
      <RecentReliefActivities></RecentReliefActivities>
      <FAQ />
    </div>
  );
}

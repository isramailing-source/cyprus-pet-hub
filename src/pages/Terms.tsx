import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Users, AlertTriangle, Scale, Globe } from "lucide-react";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Cyprus Pets - Community Guidelines & Usage Terms</title>
        <meta 
          name="description" 
          content="Cyprus Pets Terms of Service - Community guidelines, acceptable use policy, and terms for using our pet care platform and services." 
        />
        <meta name="keywords" content="cyprus pets terms of service, community guidelines, user agreement, pet platform terms" />
        <link rel="canonical" href="/terms" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
                <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                <p className="text-lg text-muted-foreground">
                  Last updated: January 2024
                </p>
                <p className="text-muted-foreground mt-4">
                  Welcome to Cyprus Pets! These Terms of Service govern your use of our platform, 
                  community, and services. By using our site, you agree to these terms.
                </p>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Acceptance of Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      By accessing and using Cyprus Pets ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>You must be at least 18 years old to use our services</li>
                      <li>You agree to provide accurate and complete information</li>
                      <li>You are responsible for maintaining the security of your account</li>
                      <li>You agree to comply with all applicable laws and regulations</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Use of Our Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Permitted Uses</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Access pet care information and educational content</li>
                          <li>Participate in community discussions and forums</li>
                          <li>Share experiences and seek advice from other pet owners</li>
                          <li>Use our product recommendations and affiliate links</li>
                          <li>Subscribe to newsletters and updates</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Prohibited Uses</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Posting harmful, offensive, or inappropriate content</li>
                          <li>Spamming, advertising, or promoting unrelated services</li>
                          <li>Impersonating other users or providing false information</li>
                          <li>Attempting to hack, disrupt, or damage our platform</li>
                          <li>Violating any applicable laws or regulations</li>
                          <li>Scraping or harvesting user data without permission</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Community Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Our community thrives on respectful, helpful, and informative interactions. We expect all users to follow these guidelines:
                      </p>
                      <div>
                        <h4 className="font-semibold mb-2">Be Respectful</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Treat all community members with kindness and respect</li>
                          <li>Avoid personal attacks, harassment, or discriminatory language</li>
                          <li>Respect differing opinions and pet care approaches</li>
                          <li>Use appropriate language suitable for all ages</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Be Helpful</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Share accurate information and personal experiences</li>
                          <li>Provide constructive feedback and advice</li>
                          <li>Help new members feel welcome</li>
                          <li>Report inappropriate content or behavior</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Stay On Topic</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Keep discussions relevant to pet care and Cyprus-specific topics</li>
                          <li>Use appropriate forum categories for your posts</li>
                          <li>Avoid excessive self-promotion or commercial posts</li>
                          <li>Search existing topics before creating new ones</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Content and Intellectual Property
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Our Content</h4>
                        <p className="text-muted-foreground">
                          All content on Cyprus Pets, including articles, guides, images, and design elements, 
                          is protected by copyright and intellectual property laws. You may use our content for 
                          personal, non-commercial purposes with proper attribution.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">User-Generated Content</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>You retain ownership of content you create and share</li>
                          <li>By posting, you grant us a license to use, display, and distribute your content</li>
                          <li>You are responsible for ensuring you have rights to any content you share</li>
                          <li>We may remove content that violates these terms or community guidelines</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Affiliate Relationships & Disclaimers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Affiliate Disclosure</h4>
                        <p className="text-muted-foreground">
                          Cyprus Pets participates in affiliate marketing programs. This means we may earn 
                          commissions when you purchase products through our links, at no additional cost to you. 
                          All recommendations are based on our genuine belief in the product's value.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Medical Disclaimer</h4>
                        <p className="text-muted-foreground">
                          The information provided on our platform is for educational purposes only and should not 
                          replace professional veterinary advice. Always consult with a qualified veterinarian for 
                          specific health concerns about your pets.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Product Recommendations</h4>
                        <p className="text-muted-foreground">
                          While we carefully curate our product recommendations, we cannot guarantee the quality, 
                          safety, or suitability of any products for your specific pet's needs. Always research 
                          and consult professionals before making purchase decisions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                      Limitation of Liability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Cyprus Pets is provided "as is" without warranties of any kind. We strive to provide 
                        accurate and helpful information, but we cannot guarantee:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>The accuracy, completeness, or timeliness of all information</li>
                        <li>That our services will be uninterrupted or error-free</li>
                        <li>The quality or safety of recommended products or services</li>
                        <li>The behavior or advice of community members</li>
                      </ul>
                      <p className="text-muted-foreground mt-4">
                        In no event shall Cyprus Pets be liable for any indirect, incidental, special, or 
                        consequential damages arising from your use of our services.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-primary" />
                      Enforcement & Modifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Enforcement</h4>
                        <p className="text-muted-foreground">
                          We reserve the right to suspend or terminate accounts that violate these terms. 
                          We may also remove content, limit functionality, or take other appropriate 
                          actions to maintain community standards.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Modifications</h4>
                        <p className="text-muted-foreground">
                          We may update these Terms of Service from time to time. Significant changes 
                          will be communicated through email or platform notifications. Continued use 
                          of our services constitutes acceptance of updated terms.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Governing Law</h4>
                        <p className="text-muted-foreground">
                          These terms are governed by the laws of Cyprus. Any disputes will be resolved 
                          through appropriate legal channels within Cyprus jurisdiction.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      If you have questions about these Terms of Service or need to report violations, please contact us:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Email: legal@cypruspets.com</li>
                      <li>Subject: Terms of Service Inquiry</li>
                      <li>Response time: Within 48 hours</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 font-semibold">
                      By using Cyprus Pets, you acknowledge that you have read, understood, and agree to 
                      be bound by these Terms of Service.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Terms;
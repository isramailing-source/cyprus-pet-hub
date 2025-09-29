import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck, Globe, Mail } from "lucide-react";

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Cyprus Pets - How We Protect Your Data</title>
        <meta 
          name="description" 
          content="Cyprus Pets Privacy Policy - Learn how we collect, use, and protect your personal information. Transparent data practices for our pet care community." 
        />
        <meta name="keywords" content="cyprus pets privacy policy, data protection, personal information, pet community privacy" />
        <link rel="canonical" href="/privacy" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
                <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-lg text-muted-foreground">
                  Last updated: January 2024
                </p>
                <p className="text-muted-foreground mt-4">
                  Cyprus Pets respects your privacy and is committed to protecting your personal data. 
                  This privacy policy explains how we collect, use, and safeguard your information.
                </p>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Information We Collect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Personal Information</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Email address (for account creation and communication)</li>
                        <li>Username and profile information (for community participation)</li>
                        <li>Pet information (optional, for personalized recommendations)</li>
                        <li>Location data (Cyprus region, for local content relevance)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Technical Information</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>IP address and browser type (for security and analytics)</li>
                        <li>Usage data and site interactions (to improve our services)</li>
                        <li>Cookies and similar tracking technologies</li>
                        <li>Device information (for mobile optimization)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-primary" />
                      How We Use Your Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Service Provision</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Provide access to our platform and community features</li>
                          <li>Deliver personalized pet care content and recommendations</li>
                          <li>Enable participation in forums and discussions</li>
                          <li>Process and fulfill product recommendations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Communication</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Send important updates about our services</li>
                          <li>Respond to your questions and support requests</li>
                          <li>Share relevant pet care tips and seasonal advice</li>
                          <li>Notify you about new features and improvements</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Improvement & Analytics</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Analyze usage patterns to improve our platform</li>
                          <li>Monitor site performance and fix technical issues</li>
                          <li>Conduct research to better serve the Cyprus pet community</li>
                          <li>Ensure security and prevent fraud</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Information Sharing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      We do not sell, trade, or rent your personal information to third parties. 
                      We may share your information only in the following limited circumstances:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (hosting, analytics, email services)</li>
                      <li><strong>Affiliate Partners:</strong> When you click affiliate links, basic referral information may be shared</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                      <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
                      <li><strong>Public Content:</strong> Forum posts and public profiles are visible to other users</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      Data Security & Retention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Security Measures</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          <li>Encrypted data transmission (SSL/TLS)</li>
                          <li>Secure database storage with access controls</li>
                          <li>Regular security audits and updates</li>
                          <li>Multi-factor authentication for admin accounts</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Data Retention</h4>
                        <p className="text-muted-foreground">
                          We retain your personal information only as long as necessary to provide our services 
                          and comply with legal obligations. You can request deletion of your account and 
                          associated data at any time.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-primary" />
                      Your Rights & Choices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        You have the following rights regarding your personal information:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                        <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                        <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
                        <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                        <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                        <li><strong>Restriction:</strong> Limit how we process your personal information</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" />
                      Cookies & Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        We use cookies and similar technologies to enhance your experience:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                        <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                        <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                        <li><strong>Marketing Cookies:</strong> Used for affiliate tracking and advertising (optional)</li>
                      </ul>
                      <p className="text-muted-foreground mt-4">
                        You can manage cookie preferences through your browser settings or our cookie consent manager.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Contact Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Email: privacy@cypruspets.com</li>
                      <li>Subject: Privacy Policy Inquiry</li>
                      <li>Response time: Within 48 hours</li>
                    </ul>
                    <p className="text-muted-foreground mt-4">
                      We may update this Privacy Policy from time to time. We will notify you of any 
                      significant changes by email or through a prominent notice on our platform.
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

export default Privacy;
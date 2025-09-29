import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, MessageSquare, Phone, MapPin, Clock, Send, Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 48 hours.",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Cyprus Pets - Get in Touch with Our Pet Care Experts</title>
        <meta 
          name="description" 
          content="Contact Cyprus Pets for pet care questions, support, partnerships, or feedback. Our expert team is here to help Cyprus pet owners with personalized advice." 
        />
        <meta name="keywords" content="contact cyprus pets, pet care support, cyprus pet advice, pet experts contact, cyprus pet community contact" />
        <link rel="canonical" href="/contact" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
              "@type": "Organization",
              "name": "Cyprus Pets",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "email": "info@cypruspets.com",
                  "contactType": "Customer Service",
                  "areaServed": "Cyprus",
                  "availableLanguage": ["English", "Greek"]
                },
                {
                  "@type": "ContactPoint",
                  "email": "support@cypruspets.com",
                  "contactType": "Technical Support"
                }
              ]
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
                <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Have questions about pet care in Cyprus? Need support or want to share feedback? 
                  Our expert team is here to help you and your furry friends.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-primary" />
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pet-care">Pet Care Advice</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                            <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                            <SelectItem value="content">Content Submission</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          type="text"
                          placeholder="Brief description of your inquiry"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Please provide details about your inquiry, including your pet type and any specific Cyprus-related context..."
                          className="min-h-32"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Email Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">General Inquiries</h4>
                        <p className="text-muted-foreground">info@cypruspets.com</p>
                        <p className="text-sm text-muted-foreground">For questions about pet care, content, and general support</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Technical Support</h4>
                        <p className="text-muted-foreground">support@cypruspets.com</p>
                        <p className="text-sm text-muted-foreground">For website issues, account problems, and technical help</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Partnerships</h4>
                        <p className="text-muted-foreground">partnerships@cypruspets.com</p>
                        <p className="text-sm text-muted-foreground">For business inquiries, collaborations, and partnerships</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Response Times
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pet Care Questions</span>
                          <span className="font-semibold">24-48 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Technical Support</span>
                          <span className="font-semibold">12-24 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">General Inquiries</span>
                          <span className="font-semibold">48 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Emergency Pet Care</span>
                          <span className="font-semibold text-primary">Contact Local Vet</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Community Support
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        For quick answers and community support, join our active forum where experienced 
                        Cyprus pet owners share advice and help each other.
                      </p>
                      <Button asChild variant="outline" className="w-full">
                        <a href="/forum">Join Community Forum</a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Cyprus Focus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        We specialize in pet care advice specifically tailored for the Cyprus Mediterranean 
                        climate, local regulations, available veterinary services, and unique challenges 
                        faced by pet owners on the island.
                      </p>
                      <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Emergency:</strong> For immediate veterinary emergencies, 
                          please contact your local veterinarian or emergency animal hospital directly.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Contact;
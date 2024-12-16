'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, Plane, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const destinations = {
  Tanzania: ['Northern Circuit', 'Southern Circuit', 'Western Circuit'],
  Kenya: ['Masai Mara', 'Amboseli', 'Tsavo'],
  Uganda: ['Bwindi', 'Queen Elizabeth', 'Murchison Falls'],
}

const locations = {
  'Northern Circuit': ['Serengeti', 'Ngorongoro', 'Tarangire', 'Lake Manyara'],
  'Southern Circuit': ['Ruaha', 'Selous', 'Mikumi'],
  'Western Circuit': ['Gombe', 'Mahale', 'Katavi'],
  'Masai Mara': ['Masai Mara Reserve', 'Mara Triangle', 'Mara North Conservancy'],
  'Amboseli': ['Amboseli National Park', 'Chyulu Hills'],
  'Tsavo': ['Tsavo East', 'Tsavo West'],
  'Bwindi': ['Bwindi Impenetrable Forest'],
  'Queen Elizabeth': ['Queen Elizabeth National Park'],
  'Murchison Falls': ['Murchison Falls National Park'],
}

const articleContexts = [
  'Home Page',
  'About Us',
  'Blog Post',
  'Service Page',
  'Destination Guide',
  'Travel Tips',
  'Safari Guide',
  'Wildlife Information',
  'Conservation',
  'Customer Stories'
]

export default function ContentGenerator() {
  const [contentType, setContentType] = useState('article')
  const [topic, setTopic] = useState('')
  const [context, setContext] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [destination, setDestination] = useState('')
  const [circuit, setCircuit] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [arrivalMethod, setArrivalMethod] = useState('')
  const [departureMethod, setDepartureMethod] = useState('')
  const [duration, setDuration] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          topic,
          context,
          companyName,
          destination,
          circuit,
          selectedLocations,
          arrivalMethod,
          departureMethod,
          duration,
        }),
      })
      const data = await response.json()
      setGeneratedContent(data.content)
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-12">
      <div className="flex justify-center">
        <Tabs defaultValue="article" className="w-full max-w-md" onValueChange={setContentType}>
          <TabsList className="inline-flex h-14 items-center justify-center rounded-full bg-gray-800 p-1 text-gray-400">
            <TabsTrigger 
              value="article" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <FileText className="mr-2 h-4 w-4" />
              Article
            </TabsTrigger>
            <TabsTrigger 
              value="itinerary"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-8 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Plane className="mr-2 h-4 w-4" />
              Itinerary
            </TabsTrigger>
          </TabsList>
          <div className="mt-8">
            <TabsContent value="article">
              <Card className="border-2 border-gray-700 bg-gray-800">
                <CardContent className="pt-6">
                  <form className="grid gap-6">
                    <div className="grid gap-2">
                      <Label className="text-base" htmlFor="topic">Topic</Label>
                      <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter the article topic"
                        className="h-12 rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-base" htmlFor="context">Context</Label>
                      <Select value={context} onValueChange={setContext}>
                        <SelectTrigger id="context" className="h-12 rounded-xl bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select content context" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {articleContexts.map((ctx) => (
                            <SelectItem key={ctx} value={ctx}>{ctx}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="itinerary">
              <Card className="border-2 border-gray-700 bg-gray-800">
                <CardContent className="pt-6">
                  <form className="grid gap-6">
                    <div className="grid gap-2">
                      <Label className="text-base" htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter your company name"
                        className="h-12 rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-base" htmlFor="destination">Destination</Label>
                      <Select value={destination} onValueChange={setDestination}>
                        <SelectTrigger id="destination" className="h-12 rounded-xl bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select a destination" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {Object.keys(destinations).map((dest) => (
                            <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {destination && (
                      <div className="grid gap-2">
                        <Label className="text-base" htmlFor="circuit">Circuit</Label>
                        <Select value={circuit} onValueChange={setCircuit}>
                          <SelectTrigger id="circuit" className="h-12 rounded-xl bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select a circuit" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {destinations[destination as keyof typeof destinations].map((circ) => (
                              <SelectItem key={circ} value={circ}>{circ}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {circuit && (
                      <div className="grid gap-2">
                        <Label className="text-base">Locations</Label>
                        <Card className="border rounded-xl border-gray-700 bg-gray-800">
                          <CardContent className="grid gap-4 pt-4">
                            {locations[circuit as keyof typeof locations].map((location) => (
                              <div key={location} className="flex items-center space-x-2">
                                <Checkbox
                                  id={location}
                                  checked={selectedLocations.includes(location)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLocations([...selectedLocations, location])
                                    } else {
                                      setSelectedLocations(selectedLocations.filter((loc) => loc !== location))
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={location}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                                >
                                  {location}
                                </label>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label className="text-base" htmlFor="arrivalMethod">Arrival Method</Label>
                      <Select value={arrivalMethod} onValueChange={setArrivalMethod}>
                        <SelectTrigger id="arrivalMethod" className="h-12 rounded-xl bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select arrival method" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="Airport">Airport</SelectItem>
                          <SelectItem value="Border">Border</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-base" htmlFor="departureMethod">Departure Method</Label>
                      <Select value={departureMethod} onValueChange={setDepartureMethod}>
                        <SelectTrigger id="departureMethod" className="h-12 rounded-xl bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select departure method" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="Airport">Airport</SelectItem>
                          <SelectItem value="Border">Border</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-base" htmlFor="duration">Trip Duration (days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Enter the trip duration"
                        className="h-12 rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className="grid gap-6">
        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            size="md"
            className="h-10 rounded-xl text-sm font-medium transition-all hover:scale-[0.98] active:scale-[0.97] bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 mx-auto"
          >
            {isLoading ? 'Generating...' : 'Generate Content'}
          </Button>
        </div>
        {generatedContent && (
          <Card className="mt-6 border-2 border-gray-700 bg-gray-800">
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight text-white">Generated Content</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className={cn(
                      "h-8 px-3 lg:px-4 transition-all duration-200 ease-in-out",
                      isCopied ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-400" : "bg-gray-700 text-white hover:bg-gray-600"
                    )}
                  >
                    {isCopied ? (
                      <>
                        <Check className="mr-2 h-3.5 w-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="prose prose-invert max-w-none">
                  <Textarea
                    value={generatedContent}
                    readOnly
                    className="min-h-[400px] resize-none rounded-xl bg-gray-700 border-gray-600 text-white font-mono text-sm leading-relaxed whitespace-pre-wrap"
                    placeholder="Generated content will appear here..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

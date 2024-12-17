'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

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

export default function SafariItineraryGenerator() {
  const [companyName, setCompanyName] = useState('')
  const [destination, setDestination] = useState('')
  const [circuit, setCircuit] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [arrivalMethod, setArrivalMethod] = useState('')
  const [duration, setDuration] = useState('')
  const [generatedItinerary, setGeneratedItinerary] = useState('')
  const [aiScore, setAiScore] = useState(0)
  const [humanScore, setHumanScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDestinationChange = (value: string) => {
    setDestination(value)
    setCircuit('')
    setSelectedLocations([])
  }

  const handleCircuitChange = (value: string) => {
    setCircuit(value)
    setSelectedLocations([])
  }

  const handleLocationChange = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    )
  }

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setGeneratedItinerary('')

    try {
      const response = await fetch('/api/generate-safari-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          destination,
          circuit,
          selectedLocations,
          arrivalMethod,
          duration,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate itinerary')
      }

      const data = await response.json()
      setGeneratedItinerary(data.content)
      setAiScore(data.aiScore)
      setHumanScore(data.humanScore)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while generating the itinerary'
      setError(errorMessage)
      console.error('Error generating safari itinerary:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const formEvent = new Event('submit') as unknown as React.FormEvent<HTMLFormElement>
    handleGenerate(formEvent)
  }

  const handleExport = (format: 'md' | 'doc' | 'pdf') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={handleGenerate} className="space-y-6">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter your company name"
            required
          />
        </div>
        <div>
          <Label htmlFor="destination">Destination</Label>
          <Select value={destination} onValueChange={handleDestinationChange}>
            <SelectTrigger id="destination">
              <SelectValue placeholder="Select a destination" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(destinations).map((dest) => (
                <SelectItem key={dest} value={dest}>
                  {dest}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {destination && (
          <div>
            <Label htmlFor="circuit">Circuit</Label>
            <Select value={circuit} onValueChange={handleCircuitChange}>
              <SelectTrigger id="circuit">
                <SelectValue placeholder="Select a circuit" />
              </SelectTrigger>
              <SelectContent>
                {destinations[destination as keyof typeof destinations].map((circ) => (
                  <SelectItem key={circ} value={circ}>
                    {circ}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {circuit && (
          <div>
            <Label>Locations</Label>
            <div className="space-y-2">
              {locations[circuit as keyof typeof locations].map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={location}
                    checked={selectedLocations.includes(location)}
                    onCheckedChange={() => handleLocationChange(location)}
                  />
                  <label
                    htmlFor={location}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {location}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <Label htmlFor="arrivalMethod">Arrival Method</Label>
          <Select value={arrivalMethod} onValueChange={setArrivalMethod}>
            <SelectTrigger id="arrivalMethod">
              <SelectValue placeholder="Select arrival method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Airport">Airport</SelectItem>
              <SelectItem value="Border">Border</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Trip Duration (days)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter the trip duration"
            required
          />
        </div>
        <Button 
          type="submit"
          size="default"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </div>
          ) : (
            'Generate Itinerary'
          )}
        </Button>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
      </form>
      <div className="space-y-4">
        <div>
          <Label htmlFor="generated-itinerary">Generated Itinerary</Label>
          <Textarea
            id="generated-itinerary"
            value={generatedItinerary}
            readOnly
            className="h-[400px]"
            placeholder="Generated itinerary will appear here..."
          />
        </div>
        {generatedItinerary && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>AI Score: {aiScore}</div>
              <div>Human Score: {humanScore}</div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => handleExport('md')}>Export MD</Button>
              <Button onClick={() => handleExport('doc')}>Export DOC</Button>
              <Button onClick={() => handleExport('pdf')}>Export PDF</Button>
            </div>
            {aiScore > humanScore && (
              <Button onClick={handleRegenerate}>Regenerate Itinerary</Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


import { useState } from 'react'
import {
  Save,
  RotateCcw,
  Store,
  MessageCircle,
  Share2,
  MapPin,
  Clock,
  CheckCircle2,
  BookOpen,
  Target,
  Sparkles,
} from 'lucide-react'

import {
  getBusinessSettings,
  saveBusinessSettings,
} from '../services/businessSettingsService'

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/20 bg-gold/5 text-gold">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="font-display text-xl text-champagne">
          {title}
        </h2>
        <p className="mt-1 text-sm text-champagne/40">
          {description}
        </p>
      </div>
    </div>
  )
}

function SettingsField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-wider text-champagne/60">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 w-full border border-white/10 bg-obsidian px-4 text-sm text-champagne placeholder:text-champagne/20 focus:border-gold/60 focus:outline-none"
      />
    </label>
  )
}

function SettingsTextarea({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  rows = 4,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs tracking-wider text-champagne/60">
        {label}
      </span>

      <textarea
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y border border-white/10 bg-obsidian px-4 py-3 text-sm leading-7 text-champagne placeholder:text-champagne/20 focus:border-gold/60 focus:outline-none"
      />
    </label>
  )
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(getBusinessSettings)
  const [savedSettings, setSavedSettings] = useState(getBusinessSettings)
  const [notice, setNotice] = useState('')

  const isDirty =
    JSON.stringify(settings) !== JSON.stringify(savedSettings)

  function handleChange(event) {
    const { name, value } = event.target

    setSettings((current) => ({
      ...current,
      [name]: value,
    }))

    setNotice('')
  }

  function handleHoursChange(day, value) {
    setSettings((current) => ({
      ...current,
      openingHours: {
        ...current.openingHours,
        [day]: value,
      },
    }))

    setNotice('')
  }

  function handleBrandValueChange(index, field, value) {
    setSettings((current) => ({
      ...current,
      brandValues: current.brandValues.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      ),
    }))

    setNotice('')
  }

  function handleSave(event) {
    event.preventDefault()

    try {
      const updatedSettings = saveBusinessSettings(settings)

      setSettings(updatedSettings)
      setSavedSettings(updatedSettings)
      setNotice('Business settings saved successfully.')
    } catch (error) {
      console.error('Could not save business settings:', error)
      setNotice('Unable to save settings. Please try again.')
    }
  }

  function handleDiscard() {
    const currentSettings = getBusinessSettings()

    setSettings(currentSettings)
    setSavedSettings(currentSettings)
    setNotice('Unsaved changes discarded.')
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-10">
        <p className="mb-3 text-xs tracking-[0.3em] text-gold">
          STORE MANAGEMENT
        </p>

        <h1 className="font-display text-3xl text-champagne md:text-4xl">
          Business Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-champagne/50">
          Manage your shop identity, customer contact channels,
          social media presence and business information.
        </p>
      </div>

      {notice && (
        <div
          role="status"
          className="mb-6 flex items-center gap-3 border border-gold/20 bg-gold/5 px-5 py-4 text-sm text-champagne/80"
        >
          <CheckCircle2 size={18} className="shrink-0 text-gold" />
          {notice}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-7">
        {/* Business identity */}
        <section className="border border-white/10 bg-[#171319] p-6 md:p-8">
          <SectionHeading
            icon={Store}
            title="Business Identity"
            description="The basic identity customers see across your store."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <SettingsField
              label="BUSINESS NAME"
              name="businessName"
              value={settings.businessName}
              onChange={handleChange}
              placeholder="Your shop name"
            />

            <SettingsField
              label="BUSINESS EMAIL"
              name="email"
              type="email"
              value={settings.email}
              onChange={handleChange}
              placeholder="Business email address"
            />
          </div>
        </section>

        {/* Contact channels */}
        <section className="border border-white/10 bg-[#171319] p-6 md:p-8">
          <SectionHeading
            icon={MessageCircle}
            title="Contact Channels"
            description="How customers can reach your business."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <SettingsField
              label="WHATSAPP BUSINESS NUMBER"
              name="whatsappNumber"
              type="tel"
              value={settings.whatsappNumber}
              onChange={handleChange}
              placeholder="International format"
            />

            <SettingsField
              label="BUSINESS PHONE NUMBER"
              name="phoneNumber"
              type="tel"
              value={settings.phoneNumber}
              onChange={handleChange}
              placeholder="Business telephone number"
            />
          </div>

          <p className="mt-4 text-xs leading-6 text-champagne/35">
            Use international telephone format for WhatsApp,
            including the country code. Do not include a plus sign
            when configuring the number.
          </p>
        </section>

        {/* Social presence */}
        <section className="border border-white/10 bg-[#171319] p-6 md:p-8">
          <SectionHeading
            icon={Share2}
            title="Social Presence"
            description="Connect customers to your official social pages."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <SettingsField
              label="INSTAGRAM PROFILE URL"
              name="instagramUrl"
              type="url"
              value={settings.instagramUrl}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
            />

            <SettingsField
              label="TIKTOK PROFILE URL"
              name="tiktokUrl"
              type="url"
              value={settings.tiktokUrl}
              onChange={handleChange}
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </section>

        {/* Location */}
        <section className="border border-white/10 bg-[#171319] p-6 md:p-8">
          <SectionHeading
            icon={MapPin}
            title="Business Location"
            description="Where customers can find or visit your business."
          />

          <SettingsField
            label="BUSINESS ADDRESS"
            name="address"
            value={settings.address}
            onChange={handleChange}
            placeholder="Enter your business address"
          />
        </section>

        {/* Opening hours */}
        <section className="border border-white/10 bg-[#171319] p-6 md:p-8">
          <SectionHeading
            icon={Clock}
            title="Opening Hours"
            description="Set the business operating hours for each day."
          />

          <div className="space-y-4">
            {DAYS.map((day) => (
              <label
                key={day}
                className="grid items-center gap-2 sm:grid-cols-[140px_1fr]"
              >
                <span className="text-sm capitalize text-champagne/70">
                  {day}
                </span>

                <input
                  type="text"
                  value={settings.openingHours?.[day] ?? ''}
                  onChange={(event) =>
                    handleHoursChange(day, event.target.value)
                  }
                  placeholder="e.g. 9:00 AM - 6:00 PM or Closed"
                  className="h-11 w-full border border-white/10 bg-obsidian px-4 text-sm text-champagne placeholder:text-champagne/20 focus:border-gold/60 focus:outline-none"
                />
              </label>
            ))}
          </div>
        </section>

        {/* About and brand story */}
        <section className="border border-white/10 bg-[#171319] p-6 md:p-8">
          <SectionHeading
            icon={BookOpen}
            title="Brand Story & About Page"
            description="Manage the story, message and presentation customers see on your homepage and About page."
          />

          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <SettingsField
                label="MAIN HEADLINE"
                name="aboutHeadline"
                value={settings.aboutHeadline}
                onChange={handleChange}
                placeholder="Beauty is an expression."
              />

              <SettingsField
                label="HIGHLIGHTED HEADLINE"
                name="aboutHeadlineAccent"
                value={settings.aboutHeadlineAccent}
                onChange={handleChange}
                placeholder="Make yours unforgettable."
              />
            </div>

            <SettingsTextarea
              label="SHORT INTRODUCTION"
              name="aboutIntroduction"
              value={settings.aboutIntroduction}
              onChange={handleChange}
              placeholder="A short introduction displayed on the homepage."
              rows={4}
            />

            <SettingsTextarea
              label="OUR STORY"
              name="aboutStory"
              value={settings.aboutStory}
              onChange={handleChange}
              placeholder="Tell customers about the business, its journey and what makes it special."
              rows={6}
            />

            <SettingsTextarea
              label="OUR MISSION"
              name="aboutMission"
              value={settings.aboutMission}
              onChange={handleChange}
              placeholder="Describe what the business hopes to achieve for its customers."
              rows={4}
            />
          </div>
        </section>

        {/* Brand values */}
        <section className="border border-white/10 bg-[#171319] p-6 md:p-8">
          <SectionHeading
            icon={Target}
            title="Our Brand Values"
            description="Edit the principles and messages that represent your business."
          />

          <div className="space-y-7">
            {(settings.brandValues ?? []).map((value, index) => (
              <div
                key={value.id ?? index}
                className="border-t border-white/10 pt-6 first:border-0 first:pt-0"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Sparkles size={16} className="text-gold" />
                  <h3 className="text-sm font-medium text-champagne">
                    Brand Value {index + 1}
                  </h3>
                </div>

                <div className="space-y-4">
                  <SettingsField
                    label="VALUE TITLE"
                    value={value.title}
                    onChange={(event) =>
                      handleBrandValueChange(
                        index,
                        'title',
                        event.target.value
                      )
                    }
                    placeholder="Enter a value title"
                  />

                  <SettingsTextarea
                    label="VALUE DESCRIPTION"
                    value={value.description}
                    onChange={(event) =>
                      handleBrandValueChange(
                        index,
                        'description',
                        event.target.value
                      )
                    }
                    placeholder="Describe this brand value."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty}
            className="inline-flex items-center gap-2 px-4 py-3 text-xs tracking-wider text-champagne/50 transition-colors hover:text-champagne disabled:cursor-not-allowed disabled:opacity-30"
          >
            <RotateCcw size={15} />
            DISCARD CHANGES
          </button>

          <button
            type="submit"
            disabled={!isDirty}
            className="inline-flex items-center gap-3 bg-gold px-7 py-4 text-xs font-semibold tracking-widest text-obsidian transition-colors hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save size={17} />
            SAVE SETTINGS
          </button>
        </div>
      </form>

      <p className="mt-8 text-xs leading-6 text-champagne/30">
        Development mode: settings are currently saved in this
        browser only. They are not yet connected to a production
        database.
      </p>
    </section>
  )
}

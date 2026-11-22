import type { LucideIcon } from 'lucide-react';
import {
  Stethoscope,
  Cable,
  Cpu,
  EthernetPort,
  Usb,
  Microchip,
  PlugZap,
  Power,
  Disc3,
  Fan,
  Sparkles,
  Droplets,
  Package,
  PackagePlus,
  Joystick,
  Plug,
  Network,
  Gamepad2,
} from 'lucide-react';

export type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  /** Price in USD before tax. 0 means free. */
  price: number;
  turnaround: string;
  highlight?: boolean;
};

export type ServiceCategory = {
  id: string;
  title: string;
  intro?: string;
  services: Service[];
};

// Single source of truth for the price list: the services page, the home page
// and the structured data in app/layout.tsx all read from here.
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'diagnostics',
    title: 'Diagnostics',
    services: [
      {
        id: 'diagnostic',
        icon: Stethoscope,
        title: 'Free Diagnostic',
        description: 'We find the problem before any work begins',
        price: 0,
        turnaround: 'Same Day',
      },
    ],
  },
  {
    id: 'port-repairs',
    title: 'Port Repairs',
    services: [
      {
        id: 'hdmi-port',
        icon: Cable,
        title: 'HDMI Port Repair',
        description: 'Fixes "No Signal," a black screen, or a loose port',
        price: 99.99,
        turnaround: 'Same Day',
      },
      {
        id: 'hdmi-port-advanced',
        icon: Cpu,
        title: 'HDMI Port Repair (Advanced)',
        description: 'For damaged traces or pads under the port',
        price: 129.99,
        turnaround: '1-2 Days',
        highlight: true,
      },
      {
        id: 'ethernet-port',
        icon: EthernetPort,
        title: 'Ethernet Port Repair',
        description: 'Restores a dead or loose wired connection',
        price: 99.99,
        turnaround: 'Same Day',
      },
      {
        id: 'usb-port',
        icon: Usb,
        title: 'USB Port Repair',
        description: "Fixes ports that won't charge or connect",
        price: 99.99,
        turnaround: 'Same Day',
      },
    ],
  },
  {
    id: 'board-power',
    title: 'Board & Power Repairs',
    services: [
      {
        id: 'bios',
        icon: Microchip,
        title: 'BIOS Repair',
        description: 'For consoles that beep 3 times and shut off',
        price: 149.99,
        turnaround: '1-2 Days',
        highlight: true,
      },
      {
        id: 'fan-connector',
        icon: PlugZap,
        title: 'Fan Connector Repair',
        description: 'Rebuilds a broken or burnt fan connector on the board',
        price: 99.99,
        turnaround: 'Same Day',
      },
      {
        id: 'power-supply',
        icon: Power,
        title: 'Power Supply Replacement',
        description: "New power supply for consoles that won't turn on",
        price: 139.99,
        turnaround: 'Same Day',
      },
      {
        id: 'disc-drive',
        icon: Disc3,
        title: 'Disc Drive Replacement',
        description: "For drives that won't read, load, or eject discs",
        price: 129.99,
        turnaround: 'Same Day',
      },
      {
        id: 'fan',
        icon: Fan,
        title: 'Fan Replacement',
        description: 'New cooling fan for a noisy or dead fan',
        price: 79.99,
        turnaround: 'Same Day',
      },
    ],
  },
  {
    id: 'cleaning-thermal',
    title: 'Cleaning & Thermal',
    services: [
      {
        id: 'deep-clean',
        icon: Sparkles,
        title: 'Full Deep Clean',
        description: 'Complete teardown and internal cleaning',
        price: 79.99,
        turnaround: 'Same Day',
      },
      {
        id: 'deep-clean-liquid-metal',
        icon: Droplets,
        title: 'Full Deep Clean + Liquid Metal',
        description: 'PS5 — full teardown and cleaning plus fresh liquid metal',
        price: 99.99,
        turnaround: 'Same Day',
        highlight: true,
      },
    ],
  },
  {
    id: 'bundles',
    title: 'Bundles',
    intro: 'Repairs that often go together on the PS5, priced as a package and done in one visit.',
    services: [
      {
        id: 'hdmi-liquid-metal',
        icon: Package,
        title: 'HDMI Port Repair + Liquid Metal',
        description: 'PS5 — new HDMI port and fresh liquid metal',
        price: 129.99,
        turnaround: 'Same Day',
        highlight: true,
      },
      {
        id: 'hdmi-deep-clean-liquid-metal',
        icon: PackagePlus,
        title: 'HDMI + Full Deep Clean + Liquid Metal',
        description: 'PS5 — new HDMI port, full teardown and cleaning, and fresh liquid metal',
        price: 179.99,
        turnaround: 'Same Day',
        highlight: true,
      },
    ],
  },
  {
    id: 'controller',
    title: 'Controller Repairs',
    services: [
      {
        id: 'stick-drift',
        icon: Joystick,
        title: 'Stick Drift Repair',
        description: 'TMR magnetic sticks installed, built to resist drift',
        price: 45,
        turnaround: 'Same Day',
        highlight: true,
      },
    ],
  },
  {
    id: 'parts',
    title: 'Parts & Accessories',
    services: [
      {
        id: 'hdmi-cable',
        icon: Plug,
        title: 'HDMI Cable',
        description: 'High-speed 4K HDMI cable',
        price: 10,
        turnaround: 'In Stock',
      },
      {
        id: 'lan-cable',
        icon: Network,
        title: 'LAN Cable',
        description: 'Ethernet cable for a stable wired connection',
        price: 10,
        turnaround: 'In Stock',
      },
      {
        id: 'stick-caps',
        icon: Gamepad2,
        title: 'Controller Stick Caps',
        description: 'Fresh replacement thumbstick caps',
        price: 10,
        turnaround: 'In Stock',
      },
    ],
  },
];

export const allServices: Service[] = serviceCategories.flatMap((category) => category.services);

export function getService(id: string): Service {
  const service = allServices.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown service id: ${id}`);
  return service;
}

/** "$99.99", or "$45" for whole-dollar prices. */
export function formatPrice(price: number): string {
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

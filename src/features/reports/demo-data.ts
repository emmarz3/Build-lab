/* ============================================================
   CampusFix — Demo Data
   Realistic sample campus maintenance reports.
   ============================================================ */

import type { IssueReport } from './report.types'

/**
 * A small set of realistic demo reports covering all statuses,
 * categories, and priorities. Used as initial seed data.
 */
export const DEMO_REPORTS: IssueReport[] = [
  {
    id: 'report_1',
    title: 'Projector in Room 204 not powering on',
    description:
      'The ceiling-mounted projector in Classroom 204 has been unresponsive. The power button registers no light and the remote control does not trigger input recognition on the screen. This has been an ongoing issue for two days and affects all afternoon lectures in the computer science department.',
    category: 'classroom-equipment',
    location: 'Building E, Room 204',
    priority: 'high',
    status: 'in-progress',
    createdAt: '2026-10-10T08:30:00.000Z',
    updatedAt: '2026-10-14T14:15:00.000Z',
    reporter: 'Alex Chen',
    activity: [
      {
        id: 'act_1a',
        timestamp: '2026-10-10T08:30:00.000Z',
        status: 'submitted',
        description: 'Report created and set to submitted.',
        performedBy: 'Alex Chen',
      },
      {
        id: 'act_1b',
        timestamp: '2026-10-10T09:45:00.000Z',
        status: 'under-review',
        description: 'Report reviewed by operations staff.',
        performedBy: 'Operations Staff',
      },
      {
        id: 'act_1c',
        timestamp: '2026-10-14T14:15:00.000Z',
        status: 'in-progress',
        description: 'Technician dispatched; replacement lamp ordered.',
        performedBy: 'Maintenance Team',
      },
    ],
  },
  {
    id: 'report_2',
    title: 'Leaking tap in Engineering Building restroom',
    description:
      'The third-floor restroom sink tap in the Engineering Building has been leaking continuously. Water drips every 2-3 seconds, causing a puddle to form on the floor. This creates a slip hazard and wastes water.',
    category: 'plumbing',
    location: 'Engineering Building, 3rd floor restroom',
    priority: 'medium',
    status: 'submitted',
    createdAt: '2026-10-15T10:15:00.000Z',
    updatedAt: '2026-10-15T10:15:00.000Z',
    reporter: 'Sam Rivera',
    activity: [
      {
        id: 'act_2a',
        timestamp: '2026-10-15T10:15:00.000Z',
        status: 'submitted',
        description: 'Report created and set to submitted.',
        performedBy: 'Sam Rivera',
      },
    ],
  },
  {
    id: 'report_3',
    title: 'Lights flickering in west wing corridor',
    description:
      'Several LED ceiling fixtures in the west wing corridor of the Library intermittently flicker, especially when the HVAC system cycles on. This creates a strobe-like effect that is distracting and concerning. The fixtures closest to the stairwell are most affected.',
    category: 'electrical',
    location: 'Central Library, West Wing Corridor',
    priority: 'medium',
    status: 'under-review',
    createdAt: '2026-10-12T16:20:00.000Z',
    updatedAt: '2026-10-13T09:00:00.000Z',
    reporter: 'Jordan Kim',
    activity: [
      {
        id: 'act_3a',
        timestamp: '2026-10-12T16:20:00.000Z',
        status: 'submitted',
        description: 'Report created and set to submitted.',
        performedBy: 'Jordan Kim',
      },
      {
        id: 'act_3b',
        timestamp: '2026-10-13T09:00:00.000Z',
        status: 'under-review',
        description: 'Facilities team assigned to inspect the fixtures.',
        performedBy: 'Operations Staff',
      },
    ],
  },
  {
    id: 'report_4',
    title: 'Overflowing bin near Student Union',
    description:
      'The waste bin near the main entrance of the Student Union is overflowing with trash and recycling. It has not been emptied since yesterday morning and is attracting pests.',
    category: 'cleaning-waste',
    location: 'Student Union, main entrance',
    priority: 'low',
    status: 'resolved',
    createdAt: '2026-10-08T12:00:00.000Z',
    updatedAt: '2026-10-09T08:30:00.000Z',
    reporter: 'Taylor Morgan',
    activity: [
      {
        id: 'act_4a',
        timestamp: '2026-10-08T12:00:00.000Z',
        status: 'submitted',
        description: 'Report created and set to submitted.',
        performedBy: 'Taylor Morgan',
      },
      {
        id: 'act_4b',
        timestamp: '2026-10-08T14:30:00.000Z',
        status: 'under-review',
        description: 'Review completed.',
        performedBy: 'Operations Staff',
      },
      {
        id: 'act_4c',
        timestamp: '2026-10-09T08:30:00.000Z',
        status: 'resolved',
        description: 'Bin emptied and area cleaned.',
        performedBy: 'Custodial Team',
      },
    ],
  },
  {
    id: 'report_5',
    title: 'Broken window in dormitory hallway',
    description:
      'The ground-floor hallway window in Maple Hall has a crack extending from the bottom corner. The glass is intact but the frame is loose. This is a security and insulation concern as the window cannot be fully closed.',
    category: 'buildings-facilities',
    location: 'Maple Hall, Ground Floor Hallway',
    priority: 'high',
    status: 'submitted',
    createdAt: '2026-10-15T14:45:00.000Z',
    updatedAt: '2026-10-15T14:45:00.000Z',
    reporter: 'Casey Brown',
    activity: [
      {
        id: 'act_5a',
        timestamp: '2026-10-15T14:45:00.000Z',
        status: 'submitted',
        description: 'Report created and set to submitted.',
        performedBy: 'Casey Brown',
      },
    ],
  },
  {
    id: 'report_6',
    title: 'Chair missing legs in Psychology lecture hall',
    description:
      'Three student chairs in the back row of the Psychology lecture hall (Room 150) have broken or missing legs, making them unstable. Students have been avoiding these seats.',
    category: 'classroom-equipment',
    location: 'Psychology Building, Room 150',
    priority: 'low',
    status: 'resolved',
    createdAt: '2026-10-05T09:00:00.000Z',
    updatedAt: '2026-10-06T11:00:00.000Z',
    reporter: 'Morgan Lee',
    activity: [
      {
        id: 'act_6a',
        timestamp: '2026-10-05T09:00:00.000Z',
        status: 'submitted',
        description: 'Report created and set to submitted.',
        performedBy: 'Morgan Lee',
      },
      {
        id: 'act_6b',
        timestamp: '2026-10-05T10:30:00.000Z',
        status: 'under-review',
        description: 'Report reviewed by operations staff.',
        performedBy: 'Operations Staff',
      },
      {
        id: 'act_6c',
        timestamp: '2026-10-06T11:00:00.000Z',
        status: 'resolved',
        description: 'Chairs replaced with new ones.',
        performedBy: 'Facilities Team',
      },
    ],
  },
]

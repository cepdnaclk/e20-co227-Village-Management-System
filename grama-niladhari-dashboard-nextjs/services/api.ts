const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiClient {
  private async fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `API request failed: ${response.status}`);
    }

    // Handle empty responses (204 No Content, 201 Created with no body, etc.)
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Check if response has no content
    if (response.status === 204 || 
        contentLength === '0' ||
        (response.status === 201 && (!contentType || !contentType.includes('application/json')))) {
      return undefined as T;
    }

    // Try to parse JSON, but handle empty responses gracefully
    try {
      const text = await response.text();
      if (!text || text.trim() === '') {
        return undefined as T;
      }
      return JSON.parse(text);
    } catch (e) {
      // If parsing fails and status is 201/204, return undefined (empty response)
      if (response.status === 201 || response.status === 204) {
        return undefined as T;
      }
      // Otherwise, it's a real parsing error
      throw new Error(`Failed to parse JSON response: ${e}`);
    }
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    return this.fetcher<DashboardStats>('/dashboard/stats');
  }

  // Persons
  async getPersons(page = 0, size = 10, orderBy = 'id', order: 'ASC' | 'DESC' = 'ASC'): Promise<PaginatedResponse<Person>> {
    return this.fetcher<PaginatedResponse<Person>>(
      `/person/?page=${page}&size=${size}&order_by=${orderBy}&order=${order}`
    );
  }

  async getPersonById(id: string): Promise<Person> {
    return this.fetcher<Person>(`/person/${id}`);
  }

  async searchPersons(keyword: string): Promise<Person[]> {
    return this.fetcher<Person[]>(`/person/search?keyword=${encodeURIComponent(keyword)}`);
  }

  async createPerson(person: Partial<Person>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/person/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(person),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create person' }));
      throw new Error(error.message || `API request failed: ${response.status}`);
    }

    // 201 Created with no body is expected
    return undefined as void;
  }

  async updatePerson(id: string, person: Partial<Person>): Promise<Person> {
    return this.fetcher<Person>(`/person/${id}`, {
      method: 'PUT',
      body: JSON.stringify(person),
    });
  }

  async deletePerson(id: string): Promise<void> {
    return this.fetcher<void>(`/person/${id}`, {
      method: 'DELETE',
    });
  }

  // Relationships
  async getRelationshipsByPersonId(personId: string): Promise<PersonRelationship[]> {
    return this.fetcher<PersonRelationship[]>(`/relationships/person/${personId}`);
  }

  async createRelationship(relationship: Partial<PersonRelationship>): Promise<PersonRelationship> {
    return this.fetcher<PersonRelationship>('/relationships', {
      method: 'POST',
      body: JSON.stringify(relationship),
    });
  }

  // Lands
  async getLands(page = 0, size = 10, orderBy = 'id', order: 'ASC' | 'DESC' = 'ASC', searchTerm?: string): Promise<PaginatedResponse<Land>> {
    const search = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
    return this.fetcher<PaginatedResponse<Land>>(
      `/land?page=${page}&size=${size}&order_by=${orderBy}&order=${order}${search}`
    );
  }

  async getLandById(id: number): Promise<Land> {
    return this.fetcher<Land>(`/land/${id}`);
  }

  async filterLands(filter: LandFilter): Promise<PaginatedResponse<Land>> {
    return this.fetcher<PaginatedResponse<Land>>('/land/filter', {
      method: 'POST',
      body: JSON.stringify(filter),
    });
  }

  async createLand(land: Partial<Land>): Promise<void> {
    return this.fetcher<void>('/land', {
      method: 'POST',
      body: JSON.stringify(land),
    });
  }

  async updateLand(id: number, land: Partial<Land>): Promise<Land> {
    return this.fetcher<Land>(`/land/${id}`, {
      method: 'PUT',
      body: JSON.stringify(land),
    });
  }

  // Certificates
  async generateCertificate(request: CertificateGenerationRequest): Promise<Certificate> {
    return this.fetcher<Certificate>('/certificates/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getCertificates(): Promise<Certificate[]> {
    return this.fetcher<Certificate[]>('/certificates');
  }

  async getCertificatesByPersonId(personId: string): Promise<Certificate[]> {
    return this.fetcher<Certificate[]>(`/certificates/person/${personId}`);
  }

  async getCertificateById(id: number): Promise<Certificate> {
    return this.fetcher<Certificate>(`/certificates/${id}`);
  }

  async downloadCertificatePdf(id: number): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}/pdf`);
    if (!response.ok) throw new Error('Failed to download certificate');
    return response.blob();
  }

  // Requests
  async getRequests(): Promise<Request[]> {
    return this.fetcher<Request[]>('/request');
  }

  async getRequestById(id: number): Promise<Request> {
    return this.fetcher<Request>(`/request/${id}`);
  }

  async getRequestsByPersonId(personId: string): Promise<Request[]> {
    return this.fetcher<Request[]>(`/request/person/${personId}`);
  }

  async createRequest(request: Partial<Request>): Promise<Request> {
    return this.fetcher<Request>('/request', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateRequest(id: number, request: Partial<Request>): Promise<Request> {
    return this.fetcher<Request>(`/request/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  // Messages
  async getMessagesByReceiverId(receiverId: string): Promise<Message[]> {
    return this.fetcher<Message[]>(`/messages/receiver/${receiverId}`);
  }

  async getMessagesBySenderId(senderId: string): Promise<Message[]> {
    return this.fetcher<Message[]>(`/messages/sender/${senderId}`);
  }

  async getUnreadMessages(receiverId: string): Promise<Message[]> {
    return this.fetcher<Message[]>(`/messages/receiver/${receiverId}/unread`);
  }

  async getUnreadMessageCount(receiverId: string): Promise<number> {
    return this.fetcher<number>(`/messages/receiver/${receiverId}/unread/count`);
  }

  async sendMessage(message: Partial<Message>): Promise<Message> {
    return this.fetcher<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    return this.fetcher<void>(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return this.fetcher<Event[]>('/events');
  }

  async getEventById(id: number): Promise<Event> {
    return this.fetcher<Event>(`/events/${id}`);
  }

  async getEventsByGramaNiladhariId(gramaNiladhariId: string): Promise<Event[]> {
    return this.fetcher<Event[]>(`/events/grama-niladhari/${gramaNiladhariId}`);
  }

  async createEvent(event: Partial<Event>): Promise<void> {
    return this.fetcher<void>('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  async updateEvent(id: number, event: Partial<Event>): Promise<void> {
    return this.fetcher<void>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  }

  // Video Conferences
  async getConferencesByGramaNiladhariId(gramaNiladhariId: string): Promise<VideoConference[]> {
    return this.fetcher<VideoConference[]>(`/video-conferences/grama-niladhari/${gramaNiladhariId}`);
  }

  async getUpcomingConferences(gramaNiladhariId: string): Promise<VideoConference[]> {
    return this.fetcher<VideoConference[]>(`/video-conferences/grama-niladhari/${gramaNiladhariId}/upcoming`);
  }

  async scheduleConference(conference: Partial<VideoConference>): Promise<VideoConference> {
    return this.fetcher<VideoConference>('/video-conferences', {
      method: 'POST',
      body: JSON.stringify(conference),
    });
  }

  async startConference(id: number): Promise<VideoConference> {
    return this.fetcher<VideoConference>(`/video-conferences/${id}/start`, {
      method: 'PUT',
    });
  }

  async endConference(id: number): Promise<VideoConference> {
    return this.fetcher<VideoConference>(`/video-conferences/${id}/end`, {
      method: 'PUT',
    });
  }

  async getMeetingLink(id: number): Promise<string> {
    const response = await this.fetcher<{ link?: string }>(`/video-conferences/${id}/meeting-link`);
    return response.link || '';
  }

  // Complaints
  async getComplaints(page = 0, size = 10, orderBy = 'time', order: 'ASC' | 'DESC' = 'DESC', searchTerm?: string): Promise<PaginatedResponse<Complaint>> {
    const search = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
    return this.fetcher<PaginatedResponse<Complaint>>(
      `/complain?page=${page}&size=${size}&order_by=${orderBy}&order=${order}${search}`
    );
  }

  async getComplaintById(id: number): Promise<Complaint> {
    return this.fetcher<Complaint>(`/complain/${id}`);
  }

  async createComplaint(complaint: Partial<Complaint>): Promise<void> {
    return this.fetcher<void>('/complain', {
      method: 'POST',
      body: JSON.stringify(complaint),
    });
  }

  // Houses
  async getHouses(): Promise<House[]> {
    return this.fetcher<House[]>('/house');
  }

  async getHouseById(id: string): Promise<House> {
    return this.fetcher<House>(`/house/${id}`);
  }

  async createHouse(house: Partial<House>): Promise<void> {
    return this.fetcher<void>('/house', {
      method: 'POST',
      body: JSON.stringify(house),
    });
  }

  async updateHouse(id: string, house: Partial<House>): Promise<House> {
    return this.fetcher<House>(`/house/${id}`, {
      method: 'PUT',
      body: JSON.stringify(house),
    });
  }

  async deleteHouse(id: string): Promise<void> {
    return this.fetcher<void>(`/house/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();

// Type definitions
export interface PaginatedResponse<T> {
  totalElements: number;
  currentPage: number;
  totalPages: number;
  [key: string]: any; // For lands, persons, etc.
}

export interface DashboardStats {
  totalVillagers: number;
  totalLands: number;
  totalCertificates: number;
  unreadMessages: number;
  pendingRequests: number;
  totalComplaints: number;
}

export interface Person {
  id: string;
  name: string;
  occupation?: string;
  dob?: string; // ISO date string
  phoneNumber?: string;
  gender?: 'MALE' | 'FEMALE';
  behavior?: string;
  health?: string;
  religion?: string;
  nation?: string;
  income?: number;
  house?: string;
  lands?: number[];
  funds?: number[];
  complains?: number[];
  requests?: number[]; // Added to match backend
}

export interface PersonRelationship {
  id: number;
  person1Id: string;
  person1Name: string;
  person2Id: string;
  person2Name: string;
  relationshipType: string;
}

export interface Land {
  id: number;
  size: number;
  owner?: string; // Person ID
  ownerName?: string;
  landType?: string;
  ownership?: string;
  coordinates?: Array<{ latitude: number; longitude: number }>;
}

export interface LandFilter {
  minSize?: number;
  maxSize?: number;
  landType?: string;
  ownership?: string;
  ownerId?: string;
  ownerName?: string;
  searchTerm?: string;
}

export interface Certificate {
  id: number;
  personId: string;
  personName: string;
  requestId?: number;
  certificateType: string;
  certificateNumber: string;
  purpose?: string;
  additionalDetails?: string;
  generatedPdfPath?: string;
  issuedDate: string;
  issuedById?: string;
  issuedByName?: string;
  isActive: boolean;
}

export interface CertificateGenerationRequest {
  personId: string;
  requestId?: number;
  certificateType: string;
  purpose?: string;
  additionalDetails?: string;
  issuedById: string;
}

export interface Request {
  id: number;
  person: string;
  requestType: string;
  time: string;
  event?: number;
}

export interface Message {
  id: number;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  readAt?: string;
  messageType: string;
  relatedRequestId?: number;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string;
  finished: boolean;
  gramaNiladhariId?: string;
  gramaNiladhariName?: string;
  eventType?: string;
  location?: string;
  attendeeIds?: string[];
  attendeeNames?: string[];
  notes?: string;
  status?: string;
}

export interface VideoConference {
  id: number;
  gramaNiladhariId: string;
  gramaNiladhariName: string;
  villagerId: string;
  villagerName: string;
  title: string;
  description?: string;
  scheduledDateTime: string;
  startTime?: string;
  endTime?: string;
  status: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  relatedRequestId?: number;
  notes?: string;
}

export interface Complaint {
  id: number;
  person: string;
  personName: string;
  complain: string;
  time: string;
  status?: string;
  completeTime?: string;
  notes?: string;
}

export interface House {
  id: string;
  name?: string;
  villageArea?: string;
  land?: number; // Land ID
  landId?: number; // Alias for land
  houseHolder?: string; // Person ID (house holder/captain)
  captainId?: string; // Alias for houseHolder
  captainName?: string;
  members?: string[]; // List of person IDs
  coordinates?: { latitude: number; longitude: number };
  latitude?: number;
  longitude?: number;
}

export enum PostStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED'
}

export enum PostType {
  MISSING_ITEM = 'MISSING_ITEM',
  RENTAL = 'RENTAL',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  MARKETPLACE = 'MARKETPLACE'
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  type: PostType;
  title: string;
  content: string;
  status: PostStatus;
  createdAt: string;
  images?: string[];
}

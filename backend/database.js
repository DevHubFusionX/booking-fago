const { MongoClient, ObjectId } = require('mongodb');
const { MONGODB_URI } = require('./config/constants');

class Database {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    const uri = MONGODB_URI;

    if (!uri) {
      console.error('❌ MongoDB URI is not defined. Check your .env file.');
      return false;
    }

    try {
      console.log('🔄 Connecting to MongoDB Atlas...');

      this.client = new MongoClient(uri);
      await this.client.connect();

      this.db = this.client.db('fagos_booking');

      // Test connection
      await this.db.admin().ping();
      this.isConnected = true;

      console.log('✅ Connected to MongoDB Atlas');

      // Initialize collections and seed data
      await this.initializeCollections();

      return true;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  async initializeCollections() {
    try {
      // Create collections with validation schemas
      const collections = [
        {
          name: 'users',
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['first_name', 'email', 'password_hash'],
              properties: {
                first_name: { bsonType: 'string' },
                last_name: { bsonType: 'string' },
                email: { bsonType: 'string' },
                phone: { bsonType: 'string' },
                password_hash: { bsonType: 'string' },
                role: { bsonType: 'string', enum: ['customer', 'admin'] },
                created_at: { bsonType: 'date' },
                updated_at: { bsonType: 'date' }
              }
            }
          }
        },
        {
          name: 'hotels',
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['name', 'location', 'rooms'],
              properties: {
                name: { bsonType: 'string' },
                location: { bsonType: 'string' },
                description: { bsonType: 'string' },
                rooms: { bsonType: 'array' },
                amenities: { bsonType: 'array' },
                images: { bsonType: 'array' },
                rating: { bsonType: 'number' }
              }
            }
          }
        },
        {
          name: 'bookings',
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['user_id', 'hotel_id', 'check_in', 'check_out'],
              properties: {
                user_id: { bsonType: 'objectId' },
                hotel_id: { bsonType: 'string' },
                room_type: { bsonType: 'string' },
                check_in: { bsonType: 'string' },
                check_out: { bsonType: 'string' },
                guests: { bsonType: 'number' },
                total_amount: { bsonType: 'number' },
                payment_status: { bsonType: 'string' },
                transaction_reference: { bsonType: 'string' },
                created_at: { bsonType: 'date' },
                updated_at: { bsonType: 'date' }
              }
            }
          }
        },
        {
          name: 'payments',
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['user_id', 'amount', 'status'],
              properties: {
                booking_id: { bsonType: 'objectId' },
                user_id: { bsonType: 'objectId' },
                amount: { bsonType: 'number' },
                currency: { bsonType: 'string' },
                status: { bsonType: 'string' },
                transaction_reference: { bsonType: 'string' },
                paystack_response: { bsonType: 'object' },
                created_at: { bsonType: 'date' }
              }
            }
          }
        },
        {
          name: 'contacts',
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['name', 'email', 'message'],
              properties: {
                name: { bsonType: 'string' },
                email: { bsonType: 'string' },
                subject: { bsonType: 'string' },
                message: { bsonType: 'string' },
                created_at: { bsonType: 'date' }
              }
            }
          }
        },
        {
          name: 'deals',
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['title', 'discount_percentage'],
              properties: {
                title: { bsonType: 'string' },
                description: { bsonType: 'string' },
                discount_percentage: { bsonType: 'number' },
                active: { bsonType: 'bool' }
              }
            }
          }
        }
      ];

      // Create collections if they don't exist
      const existingCollections = await this.db.listCollections().toArray();
      const existingNames = existingCollections.map(col => col.name);

      for (const collection of collections) {
        if (!existingNames.includes(collection.name)) {
          await this.db.createCollection(collection.name, {
            validator: collection.validator
          });
          console.log(`✅ Created collection: ${collection.name}`);
        }
      }

      // Create indexes
      await this.createIndexes();

      // Seed initial data
      await this.seedData();

    } catch (error) {
      console.error('❌ Error initializing collections:', error.message);
    }
  }

  async createIndexes() {
    try {
      // Users indexes
      await this.db.collection('users').createIndex({ email: 1 }, { unique: true });

      // Hotels indexes
      await this.db.collection('hotels').createIndex({ location: 1 });
      await this.db.collection('hotels').createIndex({ rating: -1 });

      // Bookings indexes
      await this.db.collection('bookings').createIndex({ user_id: 1 });
      await this.db.collection('bookings').createIndex({ hotel_id: 1 });

      console.log('✅ Database indexes created');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
    }
  }

  async seedData() {
    try {
      // Check if data already exists
      const hotelCount = await this.db.collection('hotels').countDocuments();
      const dealCount = await this.db.collection('deals').countDocuments();

      if (hotelCount === 0) {
        const hotels = [
          {
            _id: "hotel1",
            name: "Grand Palace Hotel",
            location: "Victoria Island, Lagos",
            description: "5-star luxury hotel with ocean view and world-class amenities",
            rooms: [
              { room_type: "Deluxe Suite", price_per_night: 45000, capacity: 2, available: true },
              { room_type: "Executive Room", price_per_night: 35000, capacity: 2, available: true },
              { room_type: "Presidential Suite", price_per_night: 85000, capacity: 4, available: true }
            ],
            amenities: ["Free WiFi", "Swimming Pool", "Gym", "Spa", "Restaurant", "Bar", "Room Service", "Laundry"],
            images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"],
            rating: 4.8
          },
          {
            _id: "hotel2",
            name: "Ocean View Resort",
            location: "Lekki, Lagos",
            description: "Beachfront resort with stunning ocean views",
            rooms: [
              { room_type: "Ocean Suite", price_per_night: 48000, capacity: 3, available: true },
              { room_type: "Beach Villa", price_per_night: 65000, capacity: 4, available: true },
              { room_type: "Standard Room", price_per_night: 32000, capacity: 2, available: true }
            ],
            amenities: ["Beach Access", "Free WiFi", "Pool", "Restaurant", "Spa", "Water Sports"],
            images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"],
            rating: 4.6
          },
          {
            _id: "hotel3",
            name: "Executive Suites Ikoyi",
            location: "Ikoyi, Lagos",
            description: "Modern business hotel in the heart of Lagos financial district",
            rooms: [
              { room_type: "Business Suite", price_per_night: 38000, capacity: 2, available: true },
              { room_type: "Executive Room", price_per_night: 28000, capacity: 2, available: true },
              { room_type: "Conference Suite", price_per_night: 55000, capacity: 6, available: true }
            ],
            amenities: ["Free WiFi", "Business Center", "Gym", "Restaurant", "Conference Rooms", "Parking"],
            images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa", "https://images.unsplash.com/photo-1590490360182-c33d57733427"],
            rating: 4.4
          },
          {
            _id: "hotel4",
            name: "Luxury Heights Hotel",
            location: "Ikeja, Lagos",
            description: "Premium hotel near Murtala Muhammed Airport with modern amenities",
            rooms: [
              { room_type: "Superior Room", price_per_night: 42000, capacity: 2, available: true },
              { room_type: "Family Suite", price_per_night: 58000, capacity: 4, available: true },
              { room_type: "Airport Suite", price_per_night: 35000, capacity: 2, available: true }
            ],
            amenities: ["Free WiFi", "Airport Shuttle", "Pool", "Gym", "Restaurant", "Bar", "Spa"],
            images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791", "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"],
            rating: 4.5
          },
          {
            _id: "hotel5",
            name: "Coastal Paradise Resort",
            location: "Ajah, Lagos",
            description: "Serene beachfront resort perfect for relaxation and getaways",
            rooms: [
              { room_type: "Garden View", price_per_night: 35000, capacity: 2, available: true },
              { room_type: "Ocean Front", price_per_night: 52000, capacity: 3, available: true },
              { room_type: "Luxury Villa", price_per_night: 78000, capacity: 6, available: true }
            ],
            amenities: ["Beach Access", "Free WiFi", "Pool", "Restaurant", "Spa", "Water Sports", "Garden"],
            images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", "https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
            rating: 4.7
          },
          {
            _id: "hotel6",
            name: "Metropolitan Hotel",
            location: "Surulere, Lagos",
            description: "Contemporary hotel in vibrant Surulere with excellent connectivity",
            rooms: [
              { room_type: "Standard Room", price_per_night: 25000, capacity: 2, available: true },
              { room_type: "Deluxe Room", price_per_night: 32000, capacity: 2, available: true },
              { room_type: "Junior Suite", price_per_night: 45000, capacity: 3, available: true }
            ],
            amenities: ["Free WiFi", "Restaurant", "Gym", "Business Center", "Parking", "Laundry"],
            images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427", "https://images.unsplash.com/photo-1578683010236-d716f9a3f461"],
            rating: 4.2
          },
          {
            _id: "hotel7",
            name: "Royal Garden Hotel",
            location: "Yaba, Lagos",
            description: "Elegant hotel with beautiful gardens and traditional hospitality",
            rooms: [
              { room_type: "Garden Room", price_per_night: 30000, capacity: 2, available: true },
              { room_type: "Royal Suite", price_per_night: 55000, capacity: 4, available: true },
              { room_type: "Executive Room", price_per_night: 38000, capacity: 2, available: true }
            ],
            amenities: ["Free WiFi", "Garden", "Restaurant", "Bar", "Event Hall", "Parking"],
            images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791", "https://images.unsplash.com/photo-1571896349842-33c89424de2d"],
            rating: 4.3
          },
          {
            _id: "hotel8",
            name: "Skyline Business Hotel",
            location: "Maryland, Lagos",
            description: "Modern business hotel with panoramic city views",
            rooms: [
              { room_type: "City View", price_per_night: 40000, capacity: 2, available: true },
              { room_type: "Business Suite", price_per_night: 50000, capacity: 2, available: true },
              { room_type: "Penthouse", price_per_night: 95000, capacity: 4, available: true }
            ],
            amenities: ["Free WiFi", "Business Center", "Gym", "Restaurant", "Bar", "Conference Rooms", "Rooftop Lounge"],
            images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"],
            rating: 4.6
          }
        ];

        await this.db.collection('hotels').insertMany(hotels);
        console.log('✅ Hotels data seeded');
      }

      if (dealCount === 0) {
        const deals = [
          {
            _id: "deal1",
            title: "Weekend Getaway Special",
            description: "Get 25% off all weekend bookings",
            discount_percentage: 25,
            active: true
          }
        ];

        await this.db.collection('deals').insertMany(deals);
        console.log('✅ Deals data seeded');
      }

      // Add more deals if they don't exist
      const currentDeals = await this.db.collection('deals').countDocuments();
      if (currentDeals < 5) {
        const additionalDeals = [
          {
            _id: "deal2",
            title: "Early Bird Special",
            description: "Book 30 days in advance and save 20%",
            discount_percentage: 20,
            active: true
          },
          {
            _id: "deal3",
            title: "Family Package",
            description: "Special rates for families with children",
            discount_percentage: 15,
            active: true
          },
          {
            _id: "deal4",
            title: "Business Traveler Deal",
            description: "Corporate rates for extended stays",
            discount_percentage: 18,
            active: true
          }
        ];

        // Insert only deals that don't exist
        for (const deal of additionalDeals) {
          try {
            await this.db.collection('deals').insertOne(deal);
          } catch (error) {
            if (error.code !== 11000) { // Ignore duplicate key errors
              console.error('Error inserting deal:', error.message);
            }
          }
        }
        console.log('✅ Additional deals seeded');
      }

    } catch (error) {
      console.error('❌ Error seeding data:', error.message);
    }
  }

  async testConnection() {
    try {
      if (!this.isConnected) {
        throw new Error('Database not connected');
      }

      // Test basic operations
      await this.db.admin().ping();

      // Count documents in each collection
      const collections = ['users', 'hotels', 'bookings', 'payments', 'contacts', 'deals'];
      const counts = {};

      for (const collection of collections) {
        counts[collection] = await this.db.collection(collection).countDocuments();
      }

      return {
        connected: true,
        database: 'fagos_booking',
        collections: counts,
        status: 'All systems operational'
      };

    } catch (error) {
      return {
        connected: false,
        error: error.message,
        status: 'Connection failed'
      };
    }
  }

  getDb() {
    return this.db;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('📴 MongoDB connection closed');
    }
  }
}

module.exports = new Database();
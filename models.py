from google.cloud import ndb


class User(ndb.Model):
    email = ndb.StringProperty()
    password = ndb.StringProperty()
    role = ndb.StringProperty()


class Property(ndb.Model):
    host_id = ndb.StringProperty()
    name = ndb.StringProperty()
    property_type = ndb.StringProperty()
    address = ndb.StringProperty()
    description = ndb.StringProperty()
    date_registered = ndb.DateTimeProperty()
    location = ndb.StringProperty()
    price = ndb.IntegerProperty()


class Bookings(ndb.Model):
    booker_id = ndb.StringProperty()
    property_id = ndb.IntegerProperty()
    booking_date=ndb.DateTimeProperty()
    check_in = ndb.DateTimeProperty()
    check_out = ndb.DateTimeProperty()
    total_paid=ndb.IntegerProperty()

class Favourites(ndb.Model):
    property_id=ndb.IntegerProperty()
    user_id=ndb.StringProperty()

class Reviews(ndb.Model):
    property_id=ndb.IntegerProperty()
    cleanliness=ndb.IntegerProperty()
    location=ndb.IntegerProperty()
    check_in=ndb.IntegerProperty()
    value=ndb.IntegerProperty()
    accuracy=ndb.IntegerProperty()
    review=ndb.StringProperty()
    posted_by=ndb.StringProperty()
    posting_date=ndb.DateTimeProperty()
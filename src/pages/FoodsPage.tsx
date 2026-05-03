import { Link } from 'react-router-dom';
import { useSnacksDrinks } from '@/lib/useSnacksDrinks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FoodsPage() {
  const { availableItems } = useSnacksDrinks();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-6xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-8">
          Foods & Drinks
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/" className="btn-outline-gold px-6 py-3 magnetic-hover">
            Back to Home
          </Link>
        </div>
        {availableItems().length === 0 ? (
          <p className="text-center text-xl text-gray-500">No available items at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {availableItems().map((item) => (
              <Card key={item.id} className="rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 overflow-hidden card-3d">
                <CardHeader className="p-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <CardTitle className="text-2xl font-bold mb-3">{item.name}</CardTitle>
                  <CardDescription className="text-gray-600 mb-6">{item.desc}</CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Available
                    </span>
                    <span className="text-3xl font-bold text-orange-500">₱{item.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .card-3d:hover {
          transform: translateY(-8px);
        }
      `}</style>
    </div>
  );
}

